System.register(['./profile.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var profile_component_1;
    var ProfileRoutes;
    return {
        setters:[
            function (profile_component_1_1) {
                profile_component_1 = profile_component_1_1;
            }],
        execute: function() {
            exports_1("ProfileRoutes", ProfileRoutes = [{
                    path: 'profile',
                    component: profile_component_1.ProfileComponent,
                }]);
        }
    }
});
//# sourceMappingURL=profile.routes.js.map