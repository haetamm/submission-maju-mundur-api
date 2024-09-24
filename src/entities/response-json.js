class ResponseJson {
    constructor(code, message) {
        this.code = code;
        this.status = "fail";
        this.message = message;
    }
}

export { ResponseJson }