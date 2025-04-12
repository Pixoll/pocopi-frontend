// noinspection JSUnusedGlobalSymbols
export class HttpException {
    /**
     * Short description of the HTTP error
     *
     * @example "Request body is malformed"
     */
    public declare message: string;

    /**
     * The HTTP status code
     *
     * @example 400
     */
    public declare statusCode: number;

    /**
     * Name of the HTTP status code
     *
     * @example "Bad Request"
     */
    public declare error?: string;
}
