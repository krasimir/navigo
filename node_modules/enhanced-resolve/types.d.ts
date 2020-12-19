/*
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 * Run `yarn special-lint-fix` to update
 */

import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from "tapable";

declare interface BaseResolveRequest {
	path: string | false;
	descriptionFilePath?: string;
	descriptionFileRoot?: string;
	descriptionFileData?: any;
	relativePath?: string;
	ignoreSymlinks?: boolean;
	fullySpecified?: boolean;
}
declare class CachedInputFileSystem {
	constructor(fileSystem?: any, duration?: any);
	fileSystem: any;
	lstat?: {
		(arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	lstatSync?: (arg0: string, arg1?: any) => FileSystemStats;
	stat: {
		(arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	statSync: (arg0: string, arg1?: any) => FileSystemStats;
	readdir: {
		(
			arg0: string,
			arg1: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>
		): void;
		(
			arg0: string,
			arg1: any,
			arg2: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>
		): void;
	};
	readdirSync: (
		arg0: string,
		arg1?: any
	) => (string | Buffer)[] | FileSystemDirent[];
	readFile: {
		(arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	readFileSync: (arg0: string, arg1?: any) => string | Buffer;
	readJson?: {
		(arg0: string, arg1: FileSystemCallback<any>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<any>): void;
	};
	readJsonSync?: (arg0: string, arg1?: any) => any;
	readlink: {
		(arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	readlinkSync: (arg0: string, arg1?: any) => string | Buffer;
	purge(what?: any): void;
}
declare class CloneBasenamePlugin {
	constructor(source?: any, target?: any);
	source: any;
	target: any;
	apply(resolver: Resolver): void;
}
declare interface FileSystem {
	readFile: {
		(arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	readdir: {
		(
			arg0: string,
			arg1: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>
		): void;
		(
			arg0: string,
			arg1: any,
			arg2: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>
		): void;
	};
	readJson?: {
		(arg0: string, arg1: FileSystemCallback<any>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<any>): void;
	};
	readlink: {
		(arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	lstat?: {
		(arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
	stat: {
		(arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
		(arg0: string, arg1: any, arg2: FileSystemCallback<string | Buffer>): void;
	};
}
declare interface FileSystemCallback<T> {
	(err?: null | (PossibleFileSystemError & Error), result?: T): any;
}
declare interface FileSystemDirent {
	name: string | Buffer;
	isDirectory: () => boolean;
	isFile: () => boolean;
}
declare interface FileSystemStats {
	isDirectory: () => boolean;
	isFile: () => boolean;
}
declare class LogInfoPlugin {
	constructor(source?: any);
	source: any;
	apply(resolver: Resolver): void;
}
declare interface ParsedIdentifier {
	request: string;
	query: string;
	fragment: string;
	directory: boolean;
	module: boolean;
	file: boolean;
	internal: boolean;
}
declare interface PnpApiImpl {
	resolveToUnqualified: (arg0: string, arg1: string, arg2?: any) => string;
}
declare interface PossibleFileSystemError {
	code?: string;
	errno?: number;
	path?: string;
	syscall?: string;
}

/**
 * Resolve context
 */
declare interface ResolveContext {
	contextDependencies?: { add: (T?: any) => void };

	/**
	 * files that was found on file system
	 */
	fileDependencies?: { add: (T?: any) => void };

	/**
	 * dependencies that was not found on file system
	 */
	missingDependencies?: { add: (T?: any) => void };

	/**
	 * set of hooks' calls. For instance, `resolve → parsedResolve → describedResolve`,
	 */
	stack?: Set<string>;

	/**
	 * log function
	 */
	log?: (arg0: string) => void;
}
declare interface ResolveOptions {
	alias: {
		alias: string | false | string[];
		name: string;
		onlyModule?: boolean;
	}[];
	fallback: {
		alias: string | false | string[];
		name: string;
		onlyModule?: boolean;
	}[];
	aliasFields: Set<string | string[]>;
	cachePredicate: (
		arg0: BaseResolveRequest & Partial<ParsedIdentifier>
	) => boolean;
	cacheWithContext: boolean;

	/**
	 * A list of exports field condition names.
	 */
	conditionNames: Set<string>;
	descriptionFiles: string[];
	enforceExtension: boolean;
	exportsFields: Set<string | string[]>;
	importsFields: Set<string | string[]>;
	extensions: Set<string>;
	fileSystem: FileSystem;
	unsafeCache: any;
	symlinks: boolean;
	resolver?: Resolver;
	modules: (string | string[])[];
	mainFields: { name: string[]; forceRelative: boolean }[];
	mainFiles: Set<string>;
	plugins: (
		| { apply: (arg0: Resolver) => void }
		| ((this: Resolver, arg1: Resolver) => void)
	)[];
	pnpApi: null | PnpApiImpl;
	roots: Set<string>;
	fullySpecified: boolean;
	resolveToContext: boolean;
	restrictions: Set<string | RegExp>;
	preferRelative: boolean;
}
declare abstract class Resolver {
	fileSystem: FileSystem;
	options: ResolveOptions;
	hooks: {
		resolveStep: SyncHook<
			[
				AsyncSeriesBailHook<
					[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
					null | (BaseResolveRequest & Partial<ParsedIdentifier>)
				>,
				BaseResolveRequest & Partial<ParsedIdentifier>
			],
			void
		>;
		noResolve: SyncHook<
			[BaseResolveRequest & Partial<ParsedIdentifier>, Error],
			void
		>;
		resolve: AsyncSeriesBailHook<
			[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
			null | (BaseResolveRequest & Partial<ParsedIdentifier>)
		>;
		result: AsyncSeriesHook<
			[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext]
		>;
	};
	ensureHook(
		name:
			| string
			| AsyncSeriesBailHook<
					[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
					null | (BaseResolveRequest & Partial<ParsedIdentifier>)
			  >
	): AsyncSeriesBailHook<
		[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
		null | (BaseResolveRequest & Partial<ParsedIdentifier>)
	>;
	getHook(
		name:
			| string
			| AsyncSeriesBailHook<
					[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
					null | (BaseResolveRequest & Partial<ParsedIdentifier>)
			  >
	): AsyncSeriesBailHook<
		[BaseResolveRequest & Partial<ParsedIdentifier>, ResolveContext],
		null | (BaseResolveRequest & Partial<ParsedIdentifier>)
	>;
	resolveSync(context: any, path: string, request: string): string | false;
	resolve(
		context: any,
		path: string,
		request: string,
		resolveContext: ResolveContext,
		callback: (
			arg0: null | Error,
			arg1?: string | false,
			arg2?: BaseResolveRequest & Partial<ParsedIdentifier>
		) => void
	): void;
	doResolve(
		hook?: any,
		request?: any,
		message?: any,
		resolveContext?: any,
		callback?: any
	): any;
	parse(identifier: string): ParsedIdentifier;
	isModule(path?: any): boolean;
	isPrivate(path?: any): boolean;
	isDirectory(path: string): boolean;
	join(path?: any, request?: any): string;
	normalize(path?: any): string;
}
declare interface UserResolveOptions {
	/**
	 * A list of module alias configurations or an object which maps key to value
	 */
	alias?:
		| { [index: string]: string | false | string[] }
		| {
				alias: string | false | string[];
				name: string;
				onlyModule?: boolean;
		  }[];

	/**
	 * A list of module alias configurations or an object which maps key to value, applied only after modules option
	 */
	fallback?:
		| { [index: string]: string | false | string[] }
		| {
				alias: string | false | string[];
				name: string;
				onlyModule?: boolean;
		  }[];

	/**
	 * A list of alias fields in description files
	 */
	aliasFields?: (string | string[])[];

	/**
	 * A function which decides whether a request should be cached or not. An object is passed with at least `path` and `request` properties.
	 */
	cachePredicate?: (
		arg0: BaseResolveRequest & Partial<ParsedIdentifier>
	) => boolean;

	/**
	 * Whether or not the unsafeCache should include request context as part of the cache key.
	 */
	cacheWithContext?: boolean;

	/**
	 * A list of description files to read from
	 */
	descriptionFiles?: string[];

	/**
	 * A list of exports field condition names.
	 */
	conditionNames?: string[];

	/**
	 * Enforce that a extension from extensions must be used
	 */
	enforceExtension?: boolean;

	/**
	 * A list of exports fields in description files
	 */
	exportsFields?: (string | string[])[];

	/**
	 * A list of imports fields in description files
	 */
	importsFields?: (string | string[])[];

	/**
	 * A list of extensions which should be tried for files
	 */
	extensions?: string[];

	/**
	 * The file system which should be used
	 */
	fileSystem: FileSystem;

	/**
	 * Use this cache object to unsafely cache the successful requests
	 */
	unsafeCache?: any;

	/**
	 * Resolve symlinks to their symlinked location
	 */
	symlinks?: boolean;

	/**
	 * A prepared Resolver to which the plugins are attached
	 */
	resolver?: Resolver;

	/**
	 * A list of directories to resolve modules from, can be absolute path or folder name
	 */
	modules?: string | string[];

	/**
	 * A list of main fields in description files
	 */
	mainFields?: (
		| string
		| string[]
		| { name: string | string[]; forceRelative: boolean }
	)[];

	/**
	 * A list of main files in directories
	 */
	mainFiles?: string[];

	/**
	 * A list of additional resolve plugins which should be applied
	 */
	plugins?: (
		| { apply: (arg0: Resolver) => void }
		| ((this: Resolver, arg1: Resolver) => void)
	)[];

	/**
	 * A PnP API that should be used - null is "never", undefined is "auto"
	 */
	pnpApi?: null | PnpApiImpl;

	/**
	 * A list of root paths
	 */
	roots?: string[];

	/**
	 * The request is already fully specified and no extensions or directories are resolved for it
	 */
	fullySpecified?: boolean;

	/**
	 * Resolve to a context instead of a file
	 */
	resolveToContext?: boolean;

	/**
	 * A list of resolve restrictions
	 */
	restrictions?: (string | RegExp)[];

	/**
	 * Use only the sync constiants of the file system calls
	 */
	useSyncFileSystemCalls?: boolean;

	/**
	 * Prefer to resolve module requests as relative requests before falling back to modules
	 */
	preferRelative?: boolean;
}
declare function exports(
	context?: any,
	path?: any,
	request?: any,
	resolveContext?: any,
	callback?: any
): void;
declare namespace exports {
	export const sync: (
		context?: any,
		path?: any,
		request?: any
	) => string | false;
	export function create(
		options?: any
	): (
		context?: any,
		path?: any,
		request?: any,
		resolveContext?: any,
		callback?: any
	) => void;
	export namespace create {
		export const sync: (
			options?: any
		) => (context?: any, path?: any, request?: any) => string | false;
	}
	export namespace ResolverFactory {
		export let createResolver: (options: UserResolveOptions) => Resolver;
	}
	export const forEachBail: (
		array?: any,
		iterator?: any,
		callback?: any
	) => any;
	export type ResolveRequest = BaseResolveRequest & Partial<ParsedIdentifier>;
	export type Plugin =
		| { apply: (arg0: Resolver) => void }
		| ((this: Resolver, arg1: Resolver) => void);
	export {
		CachedInputFileSystem,
		CloneBasenamePlugin,
		LogInfoPlugin,
		PnpApiImpl as PnpApi,
		Resolver,
		FileSystem,
		ResolveContext,
		UserResolveOptions as ResolveOptions
	};
}

export = exports;
