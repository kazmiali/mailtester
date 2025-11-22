declare enum ErrorCode {
    INVALID_CONFIG = "INVALID_CONFIG",
    MISSING_REQUIRED_OPTION = "MISSING_REQUIRED_OPTION",
    REGEX_INVALID_FORMAT = "REGEX_INVALID_FORMAT",
    TYPO_DETECTED = "TYPO_DETECTED",
    DISPOSABLE_DOMAIN = "DISPOSABLE_DOMAIN",
    MX_NOT_FOUND = "MX_NOT_FOUND",
    MX_LOOKUP_FAILED = "MX_LOOKUP_FAILED",
    SMTP_MAILBOX_NOT_FOUND = "SMTP_MAILBOX_NOT_FOUND",
    SMTP_CONNECTION_FAILED = "SMTP_CONNECTION_FAILED",
    SMTP_TIMEOUT = "SMTP_TIMEOUT",
    CACHE_ERROR = "CACHE_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    PLUGIN_ERROR = "PLUGIN_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR"
}
type ErrorSeverity = 'warning' | 'error' | 'critical';
interface ValidationError$1 {
    code: ErrorCode | string;
    message: string;
    suggestion?: string;
    severity: ErrorSeverity;
    validator?: string;
    details?: unknown;
}
interface ValidatorResult {
    valid: boolean;
    validator: string;
    error?: ValidationError$1;
    details?: Record<string, unknown>;
}
interface ValidationResult {
    valid: boolean;
    email: string;
    score: number;
    reason?: 'regex' | 'typo' | 'disposable' | 'mx' | 'smtp' | 'custom';
    validators: {
        regex?: ValidatorResult;
        typo?: ValidatorResult;
        disposable?: ValidatorResult;
        mx?: ValidatorResult;
        smtp?: ValidatorResult;
        [customValidator: string]: ValidatorResult | undefined;
    };
}
interface ValidatorConfig {
    enabled: boolean;
}
interface ValidatorOptions {
    email: string;
    validators?: {
        regex?: ValidatorConfig | boolean;
        typo?: ValidatorConfig | boolean;
        disposable?: ValidatorConfig | boolean;
        mx?: ValidatorConfig | boolean;
        smtp?: ValidatorConfig | boolean;
        [key: string]: ValidatorConfig | boolean | undefined;
    };
    earlyExit?: boolean;
    timeout?: number;
}

interface Config {
    validators?: {
        regex?: ValidatorConfig | boolean;
        typo?: ValidatorConfig | boolean;
        disposable?: ValidatorConfig | boolean;
        mx?: ValidatorConfig | boolean;
        smtp?: ValidatorConfig | boolean;
        [key: string]: ValidatorConfig | boolean | undefined;
    };
    earlyExit?: boolean;
    timeout?: number;
    preset?: 'strict' | 'balanced' | 'permissive';
}
interface MergedConfig {
    validators: Record<string, ValidatorConfig>;
    earlyExit: boolean;
    timeout: number | undefined;
}
declare class ConfigManager {
    private config;
    constructor(userConfig?: Partial<Config>);
    private mergeConfigurations;
    private getPresetConfig;
    private deepMerge;
    private normalizeValidators;
    get(): MergedConfig;
    getValue<T = unknown>(key: string): T;
    isValidatorEnabled(validatorName: string): boolean;
}

declare class ValidationError extends Error {
    readonly code: ErrorCode | string;
    readonly validator: string | undefined;
    readonly details: unknown | undefined;
    readonly severity: ErrorSeverity;
    constructor(message: string, code: ErrorCode | string, validator?: string, details?: unknown, severity?: ErrorSeverity);
    toValidationError(): ValidationError$1;
}
declare class ConfigurationError extends ValidationError {
    constructor(message: string, code?: ErrorCode, details?: unknown);
}
declare class NetworkError extends ValidationError {
    constructor(message: string, validator?: string, details?: unknown);
}
declare class TimeoutError extends ValidationError {
    constructor(message: string, validator?: string, timeout?: number, details?: unknown);
}
declare const ERROR_MESSAGES: Record<ErrorCode | string, {
    message: string;
    suggestion?: string | ((details?: unknown) => string);
    severity: ErrorSeverity;
}>;
declare function createError(code: ErrorCode | string, validator?: string, details?: unknown): ValidationError;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
interface LoggerConfig {
    enabled?: boolean;
    level?: LogLevel;
}
declare class Logger {
    private config;
    constructor(config?: LoggerConfig);
    private shouldLog;
    private formatMessage;
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    configure(config: LoggerConfig): void;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    getLevel(): LogLevel;
    setLevel(level: LogLevel): void;
}
declare function getLogger(): Logger;
declare function createLogger(config?: LoggerConfig): Logger;

declare function validateEmail(email: string): boolean;
declare const VERSION = "1.0.0";

export { type Config, ConfigManager, ConfigurationError, ERROR_MESSAGES, ErrorCode, type ErrorSeverity, type LogLevel, Logger, type LoggerConfig, type MergedConfig, NetworkError, TimeoutError, VERSION, ValidationError, type ValidationError$1 as ValidationErrorType, type ValidationResult, type ValidatorConfig, type ValidatorOptions, type ValidatorResult, createError, createLogger, getLogger, validateEmail };
