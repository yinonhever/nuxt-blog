export default function (context) {
    console.log("middleware auth");
    if (!context.store.getters.isAuth) {
        context.redirect("/admin/auth");
    }
}