class ResponseSuccess {
    constructor(code, data) {
        this.code = code;
        this.status = "success";
        this.data = data;
    }
}

export { ResponseSuccess }
