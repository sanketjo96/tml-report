class ResponseData {
    constructor() {
        this.items = 0;
        this.message = '';
        this.data = [];
        this.error = []
    }

    setData(data, message) {
        this.message = message;
        this.data = data;
        this.items = this.data.length;
    }

    addErrors(err) {
        this.error.push(err)
    }
}

module.exports = ResponseData;