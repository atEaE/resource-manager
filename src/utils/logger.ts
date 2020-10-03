
/**
 * Log level(Debug, Info, Wann, Error)
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/**
 * Logger
 */
export class Logger {
    /**
     * Minimum log level.
     */
    private outputLogLevel: LogLevel;

    /**
     * Create new logger instance.
     * @param outputLogLvel minimum log level.
     */
    constructor(outputLogLvel: LogLevel = 'DEBUG') {
        this.outputLogLevel = outputLogLvel;
    }

    /**
     * Logging.
     * @param logLevel Log level
     * @param message Log message.
     */
    public outputLog(logLevel: LogLevel, message: string) {
        switch(logLevel) {
            case 'ERROR':
                if (this.isOutput(logLevel)) console.error(logLevel + message);
                break;
            case 'WARN':
                if (this.isOutput(logLevel)) console.error(logLevel + message);
                break;
            case 'INFO':
                if (this.isOutput(logLevel)) console.log(logLevel + message);
            default:
                if (this.isOutput(logLevel)) console.log(logLevel + message)
        }
    }

    /**
     * Check if the log is available.
     * @param logLevel log level
     */
    public isOutput(logLevel: LogLevel): boolean {
        switch (this.outputLogLevel) {
            case 'ERROR':
                if (logLevel !== 'ERROR') {
                    return false;
                } else {
                    return true;
                }
            case 'WARN':
                if (logLevel === 'DEBUG' || logLevel === 'INFO') {
                    return false;
                } else {
                    return true;
                }
            case 'INFO':
                if (logLevel === 'DEBUG') {
                    return false;
                } else {
                    return true;
                }
            case 'DEBUG':
                return true;
            default:
                return false;
        }
    }
}