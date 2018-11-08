/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, NgZone } from '@angular/core';
import { $COMPILE, $INJECTOR, $PARSE, INJECTOR_KEY, LAZY_MODULE_REF, REQUIRE_INJECTOR, REQUIRE_NG_MODEL } from './constants';
import { DowngradeComponentAdapter } from './downgrade_component_adapter';
import { controllerKey, getTypeName, isFunction, validateInjectionKey } from './util';
/**
 * @record
 * @template T
 */
function Thenable() { }
/** @type {?} */
Thenable.prototype.then;
/**
 * \@description
 *
 * A helper function that allows an Angular component to be used from AngularJS.
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * This helper function returns a factory function to be used for registering
 * an AngularJS wrapper directive for "downgrading" an Angular component.
 *
 * \@usageNotes
 * ### Examples
 *
 * Let's assume that you have an Angular component called `ng2Heroes` that needs
 * to be made available in AngularJS templates.
 *
 * {\@example upgrade/static/ts/full/module.ts region="ng2-heroes"}
 *
 * We must create an AngularJS [directive](https://docs.angularjs.org/guide/directive)
 * that will make this Angular component available inside AngularJS templates.
 * The `downgradeComponent()` function returns a factory function that we
 * can use to define the AngularJS directive that wraps the "downgraded" component.
 *
 * {\@example upgrade/static/ts/full/module.ts region="ng2-heroes-wrapper"}
 *
 * \@publicApi
 * @param {?} info contains information about the Component that is being downgraded:
 *
 * - `component: Type<any>`: The type of the Component that will be downgraded
 * - `downgradedModule?: string`: The name of the downgraded module (if any) that the component
 *   "belongs to", as returned by a call to `downgradeModule()`. It is the module, whose
 *   corresponding Angular module will be bootstrapped, when the component needs to be instantiated.
 *   <br />
 *   (This option is only necessary when using `downgradeModule()` to downgrade more than one
 *   Angular module.)
 * - `propagateDigest?: boolean`: Whether to perform {\@link ChangeDetectorRef#detectChanges
 *   change detection} on the component on every
 *   [$digest](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest). If set to `false`,
 *   change detection will still be performed when any of the component's inputs changes.
 *   (Default: true)
 *
 * @return {?} a factory function that can be used to register the component in an
 * AngularJS module.
 *
 */
export function downgradeComponent(info) {
    /** @type {?} */
    var directiveFactory = function ($compile, $injector, $parse) {
        /** @type {?} */
        var needsNgZone = false;
        /** @type {?} */
        var wrapCallback = function (cb) { return cb; };
        /** @type {?} */
        var ngZone;
        return {
            restrict: 'E',
            terminal: true,
            require: [REQUIRE_INJECTOR, REQUIRE_NG_MODEL],
            link: function (scope, element, attrs, required) {
                /** @type {?} */
                var ngModel = required[1];
                /** @type {?} */
                var parentInjector = required[0];
                /** @type {?} */
                var ranAsync = false;
                if (!parentInjector) {
                    /** @type {?} */
                    var downgradedModule = info.downgradedModule || '';
                    /** @type {?} */
                    var lazyModuleRefKey = "" + LAZY_MODULE_REF + downgradedModule;
                    /** @type {?} */
                    var attemptedAction = "instantiating component '" + getTypeName(info.component) + "'";
                    validateInjectionKey($injector, downgradedModule, lazyModuleRefKey, attemptedAction);
                    /** @type {?} */
                    var lazyModuleRef = /** @type {?} */ ($injector.get(lazyModuleRefKey));
                    needsNgZone = lazyModuleRef.needsNgZone;
                    parentInjector = lazyModuleRef.injector || /** @type {?} */ (lazyModuleRef.promise);
                }
                /** @type {?} */
                var doDowngrade = function (injector) {
                    /** @type {?} */
                    var componentFactoryResolver = injector.get(ComponentFactoryResolver);
                    /** @type {?} */
                    var componentFactory = /** @type {?} */ ((componentFactoryResolver.resolveComponentFactory(info.component)));
                    if (!componentFactory) {
                        throw new Error("Expecting ComponentFactory for: " + getTypeName(info.component));
                    }
                    /** @type {?} */
                    var injectorPromise = new ParentInjectorPromise(element);
                    /** @type {?} */
                    var facade = new DowngradeComponentAdapter(element, attrs, scope, ngModel, injector, $injector, $compile, $parse, componentFactory, wrapCallback);
                    /** @type {?} */
                    var projectableNodes = facade.compileContents();
                    facade.createComponent(projectableNodes);
                    facade.setupInputs(needsNgZone, info.propagateDigest);
                    facade.setupOutputs();
                    facade.registerCleanup();
                    injectorPromise.resolve(facade.getInjector());
                    if (ranAsync) {
                        // If this is run async, it is possible that it is not run inside a
                        // digest and initial input values will not be detected.
                        scope.$evalAsync(function () { });
                    }
                };
                /** @type {?} */
                var downgradeFn = !needsNgZone ? doDowngrade : function (injector) {
                    if (!ngZone) {
                        ngZone = injector.get(NgZone);
                        wrapCallback = function (cb) { return function () {
                            return NgZone.isInAngularZone() ? cb() : ngZone.run(cb);
                        }; };
                    }
                    wrapCallback(function () { return doDowngrade(injector); })();
                };
                if (isThenable(parentInjector)) {
                    parentInjector.then(downgradeFn);
                }
                else {
                    downgradeFn(parentInjector);
                }
                ranAsync = true;
            }
        };
    };
    // bracket-notation because of closure - see #14441
    directiveFactory['$inject'] = [$COMPILE, $INJECTOR, $PARSE];
    return directiveFactory;
}
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of Angular 1's $compile.
 */
var /**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of Angular 1's $compile.
 */
ParentInjectorPromise = /** @class */ (function () {
    function ParentInjectorPromise(element) {
        this.element = element;
        this.injectorKey = controllerKey(INJECTOR_KEY);
        this.callbacks = [];
        /** @type {?} */ ((
        // Store the promise on the element.
        element.data))(this.injectorKey, this);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    ParentInjectorPromise.prototype.then = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) {
        if (this.injector) {
            callback(this.injector);
        }
        else {
            this.callbacks.push(callback);
        }
    };
    /**
     * @param {?} injector
     * @return {?}
     */
    ParentInjectorPromise.prototype.resolve = /**
     * @param {?} injector
     * @return {?}
     */
    function (injector) {
        this.injector = injector; /** @type {?} */
        ((
        // Store the real injector on the element.
        this.element.data))(this.injectorKey, injector);
        // Release the element to prevent memory leaks.
        this.element = /** @type {?} */ ((null));
        // Run the queued callbacks.
        this.callbacks.forEach(function (callback) { return callback(injector); });
        this.callbacks.length = 0;
    };
    return ParentInjectorPromise;
}());
if (false) {
    /** @type {?} */
    ParentInjectorPromise.prototype.injector;
    /** @type {?} */
    ParentInjectorPromise.prototype.injectorKey;
    /** @type {?} */
    ParentInjectorPromise.prototype.callbacks;
    /** @type {?} */
    ParentInjectorPromise.prototype.element;
}
/**
 * @template T
 * @param {?} obj
 * @return {?}
 */
function isThenable(obj) {
    return isFunction((/** @type {?} */ (obj)).then);
}
//# sourceMappingURL=downgrade_component.js.map