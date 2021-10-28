export function logout() {
    localStorage.removeItem("user-info");
    if ('caches' in window) {
        caches.keys().then((names) => {
            // Delete all the cache files
            names.forEach((name) => {
                caches.delete(name);
            });
        });
    }
    setTimeout(() => window.location.assign("/login"));
}

export function userRole() {
    let userInfo = JSON.parse(localStorage.getItem("user-info"));
    return userInfo[0].role;
}