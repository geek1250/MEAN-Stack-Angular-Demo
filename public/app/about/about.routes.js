System.register(['./about.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var about_component_1;
    var AboutRoutes;
    return {
        setters:[
            function (about_component_1_1) {
                about_component_1 = about_component_1_1;
            }],
        execute: function() {
            exports_1("AboutRoutes", AboutRoutes = [{
                    path: 'about',
                    component: about_component_1.AboutComponent,
                }]);
        }
    }
});
//# sourceMappingURL=about.routes.js.map