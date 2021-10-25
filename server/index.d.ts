/**
 * This file contains types definitions.
 */

/**
 * Basical Error Type
 */
declare type BaseError = Error & {
    message: string;
    status: number;
}
