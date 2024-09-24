export class CustomError extends Error {
    public fileName : string | undefined;
    public lineNumber : number | undefined;

    constructor(message: string, error: Error){
        super(message);

        //set the prototype explicitly for compatability with built-in Erro
        Object.setPrototypeOf(this, CustomError.prototype);

        this.name = this.constructor.name;

        // Capture stack trace and xtract file name and line number
        if (error.stack) {
            const stackLlines = (error.stack || '').split("\n");
            const relevantLine = stackLlines[1]; // Second line is where the error occured

            const match = /at (.+):(\d+):(\d+)/.exec(relevantLine);

            if (match) {
                this.fileName = match[1];
                this.lineNumber = parseInt(match[2], 10);
            }
        }
    }

    getErrorMessage() : string {
        return `Error occured in ${this.fileName || "unknown file"} at line ${this.lineNumber || "unknown line"}, message: ${this.message}`;
    }
}