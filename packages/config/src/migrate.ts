import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { parseConfig } from "./parser";
import {
    type FlatRawConfig,
    type FlatRawPhase,
    FormQuestionType,
    type RawForm,
    type RawFormOption,
    type RawFormQuestion,
    type RawImage,
    RawPhaseQuestion,
    type RawTestOption,
} from "./raw-types";

const PROJECT_ROOT = path.join(__dirname, "../../../");
const BACKEND_DATA_PATH = path.join(PROJECT_ROOT, "apps/backend/data");
const FORMS_PATH = path.join(BACKEND_DATA_PATH, "forms");
const TIME_LOGS_PATH = path.join(BACKEND_DATA_PATH, "timelogs");
const USERS_PATH = path.join(BACKEND_DATA_PATH, "users");

const destFileName = process.argv[2];
if (!destFileName) {
    console.error("Provide the destination file name");
    process.exit(1);
}

const configId = 1;
const config = parseConfig();
const images = getImages(config);
const sql = migrateToSql(config);
const destPath = path.join(PROJECT_ROOT, destFileName);

writeFileSync(destPath, sql, "utf-8");
console.log(`Dumped SQL to ${destPath}`);
process.exit(0);

function migrateToSql(config: FlatRawConfig): string {
    const imagesSql = Object.keys(images).length > 0
        ? "insert into image (path, alt) values\n"
        + Object.values(images)
            .map(image => `(${valueToSql(image.src)}, ${valueToSql(image.alt)})`)
            .join(",\n")
        + ";\n"
        : "";

    const configSql = "insert into config (icon_id, title, subtitle, description, informed_consent, anonymous) values\n"
        + tupleToSql(
            images[config.icon.src]?.id,
            config.title,
            config.subtitle,
            config.description,
            config.informedConsent,
            config.anonymous
        )
        + ";\n";

    const translationsSql = Object.keys(config.translations).length > 0
        ? "insert into translation (config_version, `key`, value) values\n"
        + Object.entries(config.translations).map(([key, value]) =>
            tupleToSql(configId, key, value)
        ).join(",\n")
        + ";\n"
        : "";

    const homeInfoCardsSql = config.informationCards && config.informationCards.length > 0
        ? "insert into home_info_card (config_version, `order`, title, description, icon_id, color) values\n"
        + config.informationCards.map((card, order) =>
            tupleToSql(
                configId,
                order + 1,
                card.title,
                card.description,
                images[card.icon?.src ?? ""]?.id,
                card.color !== undefined ? (card.color.r << 16) + (card.color.g << 8) + card.color.b : null
            )
        ).join(",\n")
        + ";\n"
        : "";

    const homeFaqSql = config.faq && config.faq.length > 0
        ? "insert into home_faq (config_version, `order`, question, answer) values\n"
        + config.faq.map((faq, order) =>
            tupleToSql(configId, order + 1, faq.question, faq.answer)
        ).join(",\n")
        + ";\n"
        : "";

    const { sql: formsSql, ...formsData } = formsToSql(config);
    const { sql: testsSql, ...testsData } = testsToSql(config);
    const userDataSql = userDataToSql(config, { ...formsData, ...testsData });

    return [
        imagesSql,
        configSql,
        translationsSql,
        homeInfoCardsSql,
        homeFaqSql,
        formsSql,
        testsSql,
        userDataSql,
    ].filter(Boolean).join("\n");
}

function userDataToSql(
    config: FlatRawConfig,
    data: Omit<TestsToSQLResult, "sql"> & Omit<FormsToSQLResult, "sql">
): string {
    const userFiles = existsSync(USERS_PATH)
        ? readdirSync(USERS_PATH).map<User>(f =>
            JSON.parse(readFileSync(path.join(USERS_PATH, f), "utf-8"))
        )
        : [];

    if (userFiles.length === 0) {
        return "";
    }

    const formFiles = existsSync(FORMS_PATH)
        ? readdirSync(FORMS_PATH).map<Form>(f => ({
            type: f.match(/-(pre|post)-test\.json$/)?.[1],
            ...JSON.parse(readFileSync(path.join(FORMS_PATH, f), "utf-8")),
        }))
        : [];

    const timeLogFiles = existsSync(TIME_LOGS_PATH)
        ? readdirSync(TIME_LOGS_PATH).map<TimeLog>(f =>
            JSON.parse(readFileSync(path.join(TIME_LOGS_PATH, f), "utf-8"))
        )
        : [];

    let userId = 1;

    const userTuples: string[] = [];
    const formAnswerTuples: string[] = [];
    const testQuestionLogTuples: string[] = [];
    const testOptionLogTuples: string[] = [];

    const { formQuestionToId, formOptionToId, testGroupToId, testPhaseToId, testQuestionToId, testOptionToId } = data;
    const idToUser: Record<string, { id: number; group: string }> = {};

    for (const user of userFiles) {
        const groupId = testGroupToId[user.group];
        if (!groupId) {
            console.warn(`Could not identify group '${user.group}' while parsing stored user json files`, user);
            continue;
        }

        userTuples.push(tupleToSql(
            user.id,
            groupId,
            user.anonymous,
            user.name,
            user.email,
            user.age,
            "-"
        ));

        idToUser[user.id] = {
            id: userId,
            group: user.group,
        };
        userId++;
    }

    for (const formAnswer of formFiles) {
        const user = idToUser[formAnswer.userId];
        if (!user) {
            console.warn(
                `Could not identify user '${formAnswer.userId}' while parsing stored form json files`,
                formAnswer
            );
            continue;
        }

        const form = formAnswer.type === "pre" ? config.preTestForm : config.postTestForm;
        if (!form) {
            console.warn(
                "Could not identify form type while parsing stored form json files",
                formAnswer
            );
            continue;
        }

        for (const answer of formAnswer.answers) {
            const question = form.questions[answer.questionId - 1];
            if (!question) {
                console.warn(
                    `Could not find form question with index ${answer.questionId - 1} type while parsing stored form `
                    + "json files",
                    formAnswer
                );
                continue;
            }

            const questionId = formQuestionToId.get(question);
            if (!questionId) {
                console.warn(
                    "Could not identify form question type while parsing stored form json files",
                    question
                );
                continue;
            }

            const values: Array<Value | ValueWithDefault> = [user.id, questionId];

            switch (question.type) {
                case FormQuestionType.SELECT_ONE:
                case FormQuestionType.SELECT_MULTIPLE: {
                    const option = question.options.find(o => o.text === answer.answers[0]);
                    const optionId = option ? formOptionToId.get(option) : undefined;

                    values.push(optionId, null, !optionId ? answer.answers[0] : null);
                    break;
                }

                case FormQuestionType.NUMBER:
                case FormQuestionType.SLIDER:
                    values.push(null, +(answer.answers[0] ?? 0), null);
                    break;

                case FormQuestionType.TEXT_SHORT:
                case FormQuestionType.TEXT_LONG:
                    values.push(null, null, answer.answers[0]);
                    break;
            }

            formAnswerTuples.push(tupleToSql(...values));
        }
    }

    for (const timeLog of timeLogFiles) {
        const user = idToUser[timeLog.userId];
        if (!user) {
            console.warn(`Could not identify user '${timeLog.userId}' while parsing stored time-log json files`, timeLog);
            continue;
        }

        const phase = config.groups[user.group]?.protocol.phases[timeLog.phaseId - 1];
        if (!phase) {
            console.warn(
                `Could not find test phase with index ${timeLog.phaseId - 1} type while parsing stored time-log json `
                + "files",
                timeLog
            );
            continue;
        }

        const phaseId = testPhaseToId.get(phase);
        if (!phaseId) {
            console.warn("Could not identify test phase type while parsing stored time-log json files", phase);
            continue;
        }

        const question = phase.questions[timeLog.questionId - 1];
        if (!question) {
            console.warn(
                `Could not find test question with index ${timeLog.questionId - 1} type while parsing stored time-log `
                + "json files",
                phase
            );
            continue;
        }

        const questionId = testQuestionToId.get(question);
        if (!questionId) {
            console.warn("Could not identify test question type while parsing stored time-log json files", question);
            continue;
        }

        testQuestionLogTuples.push(tupleToSql(
            user.id,
            questionId,
            new Date(timeLog.startTimestamp),
            timeLog.endTimestamp - timeLog.startTimestamp
        ));

        for (const event of timeLog.events) {
            const option = question.options[event.optionId - 1];
            if (!option) {
                console.warn(
                    `Could not find test option with index ${event.optionId - 1} type while parsing stored time-log `
                    + "json files",
                    question
                );
                continue;
            }

            const optionId = testOptionToId.get(option);
            if (!optionId) {
                console.warn("Could not identify test option type while parsing stored time-log json files", option);
                continue;
            }

            testOptionLogTuples.push(tupleToSql(user.id, optionId, event.type, new Date(event.timestamp)));
        }
    }

    const usersSql = "insert into user (username, group_id, anonymous, name, email, age, password) values\n"
        + userTuples.join(",\n")
        + ";\n";

    const formAnswersSql = formAnswerTuples.length > 0
        ? "insert into user_form_answer (user_id, question_id, option_id, value, answer) values\n"
        + formAnswerTuples.join(",\n")
        + ";\n"
        : "";

    const testQuestionLogsSql = testQuestionLogTuples.length > 0
        ? "insert into user_test_question_log (user_id, question_id, timestamp, duration) values\n"
        + testQuestionLogTuples.join(",\n")
        + ";\n"
        : "";

    const testOptionLogsSql = testOptionLogTuples.length > 0
        ? "insert into user_test_option_log (user_id, option_id, type, timestamp) values\n"
        + testOptionLogTuples.join(",\n")
        + ";\n"
        : "";

    return [usersSql, formAnswersSql, testQuestionLogsSql, testOptionLogsSql].filter(Boolean).join("\n");
}

type TestsToSQLResult = {
    sql: string;
    testGroupToId: Record<string, number>;
    testPhaseToId: Map<FlatRawPhase, number>;
    testQuestionToId: Map<RawPhaseQuestion, number>;
    testOptionToId: Map<RawTestOption, number>;
};

function testsToSql(config: Pick<FlatRawConfig, "groups">): TestsToSQLResult {
    let groupId = 1;
    let protocolId = 1;
    let phaseId = 1;
    let questionId = 1;
    let optionId = 1;

    const groupTuples: string[] = [];
    const protocolTuples: string[] = [];
    const phaseTuples: string[] = [];
    const questionTuples: string[] = [];
    const optionTuples: string[] = [];

    const testGroupToId: Record<string, number> = {};
    const testPhaseToId = new Map<FlatRawPhase, number>();
    const testQuestionToId = new Map<RawPhaseQuestion, number>();
    const testOptionToId = new Map<RawTestOption, number>();

    for (const [groupLabel, group] of Object.entries(config.groups)) {
        groupTuples.push(tupleToSql(configId, groupLabel, group.probability, group.greeting));

        testGroupToId[groupLabel] = groupId;

        protocolTuples.push(tupleToSql(
            configId,
            groupLabel,
            groupId,
            group.protocol.allowPreviousPhase,
            group.protocol.allowPreviousQuestion,
            group.protocol.allowSkipQuestion,
            group.protocol.randomize
        ));

        const phases = group.protocol.phases;

        for (let phaseOrder = 1; phaseOrder <= phases.length; phaseOrder++) {
            const phase = phases[phaseOrder - 1]!;

            phaseTuples.push(tupleToSql(protocolId, phaseOrder, phase.randomize));
            testPhaseToId.set(phase, phaseId);

            for (let questionOrder = 1; questionOrder <= phase.questions.length; questionOrder++) {
                const question = phase.questions[questionOrder - 1]!;

                questionTuples.push(tupleToSql(
                    phaseId,
                    questionOrder,
                    question.text,
                    images[question.image?.src ?? ""]?.id,
                    question.randomize
                ));
                testQuestionToId.set(question, questionId);

                /* eslint-disable max-depth */
                for (let optionOrder = 1; optionOrder <= question.options.length; optionOrder++) {
                    const option = question.options[optionOrder - 1]!;

                    optionTuples.push(tupleToSql(
                        questionId,
                        optionOrder,
                        option.text,
                        images[option.image?.src ?? ""]?.id,
                        [option.correct, false]
                    ));
                    testOptionToId.set(option, optionId);

                    optionId++;
                }
                /* eslint-enable max-depth */

                questionId++;
            }

            phaseId++;
        }

        protocolId++;
        groupId++;
    }

    const groupsSql = groupTuples.length > 0
        ? "insert into test_group (config_version, label, probability, greeting) values\n"
        + groupTuples.join(",\n")
        + ";\n"
        : "";

    const protocolsSql = protocolTuples.length > 0
        ? "insert into test_protocol (config_version, label, group_id, allow_previous_phase, allow_previous_question, "
        + "allow_skip_question, randomize_phases) values\n"
        + protocolTuples.join(",\n")
        + ";\n"
        : "";

    const phasesSql = phaseTuples.length > 0
        ? "insert into test_phase (protocol_id, `order`, randomize_questions) values\n"
        + phaseTuples.join(",\n")
        + ";\n"
        : "";

    const questionsSql = questionTuples.length > 0
        ? "insert into test_question (phase_id, `order`, text, image_id, randomize_options) values\n"
        + questionTuples.join(",\n")
        + ";\n"
        : "";

    const optionsSql = optionTuples.length > 0
        ? "insert into test_option (question_id, `order`, text, image_id, correct) values\n"
        + optionTuples.join(",\n")
        + ";\n"
        : "";

    const sql = [groupsSql, protocolsSql, phasesSql, questionsSql, optionsSql].filter(Boolean).join("\n");

    return { sql, testGroupToId, testPhaseToId, testQuestionToId, testOptionToId };
}

type FormsToSQLResult = {
    sql: string;
    formQuestionToId: Map<RawFormQuestion, number>;
    formOptionToId: Map<RawFormOption, number>;
};

function formsToSql(config: Pick<FlatRawConfig, "preTestForm" | "postTestForm">): FormsToSQLResult {
    const forms: Array<RawForm & { type: "pre" | "post" }> = [];

    if (config.preTestForm) {
        forms.push({ ...config.preTestForm, type: "pre" });
    }
    if (config.postTestForm) {
        forms.push({ ...config.postTestForm, type: "post" });
    }

    const formQuestionToId = new Map<RawFormQuestion, number>();
    const formOptionToId = new Map<RawFormOption, number>();

    if (forms.length === 0) {
        return { sql: "", formQuestionToId, formOptionToId };
    }

    const formsSql = "insert into form (config_version, type) values\n"
        + forms.map(form =>
            tupleToSql(configId, form.type)
        ).join(",\n")
        + ";\n";

    let formQuestionId = 1;
    let formOptionId = 1;

    const formQuestionTuples: string[] = [];
    const formQuestionOptionTuples: string[] = [];
    const formQuestionSliderLabelTuples: string[] = [];

    for (let formId = 1; formId <= forms.length; formId++) {
        const form = forms[formId - 1]!;

        for (let questionOrder = 1; questionOrder <= form.questions.length; questionOrder++) {
            const question = form.questions[questionOrder - 1]!;

            const values: Array<Value | ValueWithDefault> = [
                formId,
                questionOrder,
                question.category,
                question.text,
                images[question.image?.src ?? ""]?.id,
                question.type === FormQuestionType.NUMBER ? FormQuestionType.SLIDER : question.type,
            ];

            let options: RawFormOption[] = [];
            let labels: Record<`${number}`, string> = {};

            switch (question.type) {
                case FormQuestionType.SELECT_ONE:
                    values.push(null, null, null, [question.other, false], null, null, null);
                    options = question.options;
                    break;
                case FormQuestionType.SELECT_MULTIPLE:
                    values.push(question.min, question.max, null, [question.other, false], null, null, null);
                    options = question.options;
                    break;
                case FormQuestionType.NUMBER:
                    values.push(question.min, question.max, question.step, null, null, null, null);
                    break;
                case FormQuestionType.SLIDER:
                    values.push(question.min, question.max, question.step, null, null, null, null);
                    labels = question.labels ?? {};
                    break;
                case FormQuestionType.TEXT_SHORT:
                case FormQuestionType.TEXT_LONG:
                    values.push(null, null, null, null, question.minLength, question.maxLength, question.placeholder);
                    break;
            }

            formQuestionTuples.push(tupleToSql(...values));
            formQuestionToId.set(question, formQuestionId);

            for (let optionOrder = 1; optionOrder <= options.length; optionOrder++) {
                const option = options[optionOrder - 1]!;

                formQuestionOptionTuples.push(tupleToSql(
                    formQuestionId,
                    optionOrder,
                    option.text,
                    images[option.image?.src ?? ""]?.id
                ));
                formOptionToId.set(option, formOptionId);

                formOptionId++;
            }

            for (const [number, label] of Object.entries(labels)) {
                formQuestionSliderLabelTuples.push(tupleToSql(formQuestionId, +number, label));
            }

            formQuestionId++;
        }
    }

    const formQuestionsSql = "insert into form_question (form_id, `order`, category, text, image_id, type, "
        + "min, max, step, other, min_length, max_length, placeholder) values\n"
        + formQuestionTuples.join(",\n")
        + ";\n";

    const formQuestionOptionsSql = formQuestionOptionTuples.length > 0
        ? "insert into form_question_option (form_question_id, `order`, text, image_id) values\n"
        + formQuestionOptionTuples.join(",\n")
        + ";\n"
        : "";

    const formQuestionSliderLabelsSql = formQuestionSliderLabelTuples.length > 0
        ? "insert into form_question_slider_label (form_question_id, number, label) values\n"
        + formQuestionSliderLabelTuples.join(",\n")
        + ";\n"
        : "";

    const sql = [formsSql, formQuestionsSql, formQuestionOptionsSql, formQuestionSliderLabelsSql].filter(Boolean).join("\n");

    return { sql, formQuestionToId, formOptionToId };
}

function tupleToSql(...values: Array<Value | ValueWithDefault>): string {
    return "("
        + values.map(v =>
            Array.isArray(v) ? valueToSql(v[0], v[1]) : valueToSql(v)
        ).join(", ")
        + ")";
}

type Value = boolean | Date | number | string | null | undefined;
type ValueWithDefault =
    | [value: boolean | null | undefined, defaultValue: boolean]
    | [value: Date | null | undefined, defaultValue: Date]
    | [value: number | null | undefined, defaultValue: number]
    | [value: string | null | undefined, defaultValue: string];

function valueToSql<T extends Value>(value: T, defaultValue?: NonNullable<T>): string {
    if (value === null) {
        return "null";
    }

    if (value === undefined) {
        if (defaultValue === undefined) {
            return "default";
        }

        value = defaultValue;
    }

    if (value instanceof Date) {
        return `from_unixtime(${value.getTime()} / 1000)`;
    }

    switch (typeof value) {
        case "bigint":
        case "number":
            return `${value}`;
        case "boolean":
            return value ? "true" : "false";
        case "string":
            return value ? `'${value.replace(/'/g, "\\'").replace(/\n/g, "\\n")}'` : "null";
        default:
            throw new Error(`Cannot parse ${typeof value} ${value}`);
    }
}

function getImages(config: FlatRawConfig): Record<string, SqlImage> {
    let id = 1;

    const images: Record<string, SqlImage> = {};

    const add = (image: RawImage): void => {
        images[image.src] = {
            id: id++,
            ...image,
        };
    };

    add(config.icon);

    for (const card of config.informationCards ?? []) {
        if (card.icon) {
            add(card.icon);
        }
    }

    for (const form of [config.preTestForm, config.postTestForm]) {
        for (const question of form?.questions ?? []) {
            if (question.image) {
                add(question.image);
            }

            if (question.type !== FormQuestionType.SELECT_ONE && question.type !== FormQuestionType.SELECT_MULTIPLE) {
                continue;
            }

            for (const option of question.options) {
                // eslint-disable-next-line max-depth
                if (option.image) {
                    add(option.image);
                }
            }
        }
    }

    for (const question of createTestQuestionsIterator(config)) {
        if (question.image) {
            add(question.image);
        }

        for (const option of question.options) {
            if (option.image) {
                add(option.image);
            }
        }
    }

    return images;
}

function* createTestQuestionsIterator(config: FlatRawConfig): QuestionsIterator {
    for (const group of Object.values(config.groups)) {
        for (const phase of group.protocol.phases) {
            for (const question of phase.questions) {
                yield question;
            }
        }
    }
}

type QuestionsIterator = Generator<RawPhaseQuestion, void, unknown>;

type SqlImage = RawImage & {
    id: number;
};

type User = {
    anonymous: boolean;
    id: string;
    group: string;
    name?: string;
    email?: string;
    age?: number;
};

type TimeLogEvent = {
    type: "deselect" | "hover" | "select";
    optionId: number;
    timestamp: number;
};

type TimeLog = {
    userId: string;
    phaseId: number;
    questionId: number;
    startTimestamp: number;
    endTimestamp: number;
    correct: boolean;
    skipped: boolean;
    totalOptionChanges: number;
    totalOptionHovers: number;
    events: TimeLogEvent[];
};

type FormAnswer = {
    questionId: number;
    answers: string[];
};

type Form = {
    type: "pre" | "post";
    userId: string;
    answers: FormAnswer[];
};
