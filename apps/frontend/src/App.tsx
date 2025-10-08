import api, {type CreateUserRequest, type SingleConfigResponse, type Group} from "@/api";
//import {AnalyticsDashboard} from "@/pages/AnalyticsDashboard";
import {CompletionModal} from "@/pages/CompletionModal";
import {FormPage} from "@/pages/FormPage";
import {HomePage} from "@/pages/HomePage";
import {TestGreetingPage} from "@/pages/TestGreetingPage";
import {TestPage} from "@/pages/TestPage";
import {AdminPage} from "@/pages/AdminPage";
//import mime from "mime";
import {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Decimal from "decimal.js";

enum Page {
  HOME,
  PRETEST,
  GREETING,
  TEST,
  POSTTEST,
  END,
  DASHBOARD,
}

function sampleGroup(config: SingleConfigResponse): Group {
  const groupsArray = Object.values(config.groups);
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0]!;
  const targetProbability = new Decimal("0." + randomValue.toString().split("").reverse().join(""));

  const probabilitySums: Decimal[] = [];
  let lastProbability = new Decimal(0);

  for (const group of groupsArray) {
    const prob = new Decimal(group.probability ?? 0).div(100);
    lastProbability = lastProbability.add(prob);
    probabilitySums.push(lastProbability);
  }

  let left = 0;
  let right = probabilitySums.length - 1;
  let index = 0;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const value = probabilitySums[mid]!;

    if (value.greaterThan(targetProbability)) {
      index = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return groupsArray[index]!;
}

export function App() {
  const [config, setConfig] = useState<SingleConfigResponse | null>(null);

  const [group, setGroup] = useState<Group | null>(null);
  const [page, setPage] = useState<Page>(Page.HOME);
  const [userData, setUserData] = useState<CreateUserRequest | null>(null);

  async function getConfig(): Promise<void> {
    try{
      const response = await api.getLastestConfig();
      if(response.data){
        setConfig(response.data);
        setGroup(sampleGroup(response.data));
        document.title = response.data.title ?? "";
        /*if(response.data.icon){
          const head = document.querySelector("head")!;
          const link = document.createElement("link");
          link.rel = "icon";
          //link.type = mime.getType(response.data.icon.url ?? "")!;
          //link.href = response.data.icon.url ?? "";
          head.appendChild(link);
        }*/

      }else{
        console.error(response.error);

      }
    }catch (error){
      console.error(error);
    }
  }
  useEffect(() => {
    getConfig();
  }, []);

  const goToPreTest = (data: CreateUserRequest) => {
    window.scrollTo(0, 0);
    setUserData(data);
    setPage(Page.TEST);
  };

  const goToGreeting = () => {
    window.scrollTo(0, 0);
    setPage(Page.GREETING);
  };

  const goToTest = () => {
    window.scrollTo(0, 0);
    setPage(Page.TEST);
  };

  const goToPostTest = () => {
    window.scrollTo(0, 0);
    setPage(Page.POSTTEST);
  };

  const goToEnd = () => {
    window.scrollTo(0, 0);
    setPage(Page.END);
  };

  const goToHome = () => {
    window.scrollTo(0, 0);
    setPage(Page.HOME);
  };

  const goToDashboard = () => {
    window.scrollTo(0, 0);
    setPage(Page.DASHBOARD);
  };

  if(!group || !config){
    return (<div>Cargando...</div>)
  }
  switch (page) {
    case Page.HOME:
      return <HomePage group={group} config={config} goToNextPage={goToPreTest} onDashboard={goToDashboard}/>;
    case Page.PRETEST:
      return <FormPage config={config} type="pre-test" username={userData?.username ?? ""} goToNextPage={goToGreeting}/>;
    case Page.GREETING:
      return <TestGreetingPage config={config} groupGreeting={group.greeting} goToNextPage={goToTest}/>;
    case Page.TEST:
      return <TestPage config={config} protocol={group.protocol} goToNextPage={goToPostTest} userData={userData!}/>;
    case Page.POSTTEST:
      return <FormPage config={config} type="post-test" username={userData?.username ?? ""} goToNextPage={goToEnd}/>;
    case Page.END:
      return <CompletionModal config={config} userData={userData!} onBackToHome={goToHome}/>;
    case Page.DASHBOARD:
      return <AdminPage />
    //case Page.DASHBOARD:
      //return <AnalyticsDashboard config={config} onBack={goToHome}/>;
  }
}
