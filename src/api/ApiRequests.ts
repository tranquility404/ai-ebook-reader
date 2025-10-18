import apiAuthClient, { apiPublicClient } from "./apiClient";

// --------------Auth/Public/Health-Checks---------------
export function register(credentials: any) {
    return apiPublicClient.post("auth/register", credentials);
}

export function login(credentials: any) {
    return apiPublicClient.post("auth/login", credentials);
}

export function checkMainHealth() {
    return apiPublicClient.get("/auth/health-check");
}

export function checkMLHealth() {
    return apiAuthClient.get("/ml/public/health-check");
}


// ---------------Users Controller------------------------------
export function checkUserAuthStatus() {     // return OK if user is authenticated
    return apiAuthClient.get("users/auth-status");
}

export function getMyProfileInfo() {
    return apiAuthClient.get("/users/info");
}

export function updateMyProfileInfo(body: any) {
    return apiAuthClient.post('/users/info', body);
}

export function getProfilePicture() {
    return apiAuthClient.get("/users/profile-picture");
}

export function updateProfilePicture(fileData: any) {
    return apiAuthClient.post("/users/profile-picture", fileData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}


// ---------------Books Controller------------------------------
export function searchBooks(query: string) {
    return apiAuthClient.get(`/books/search?q=${encodeURIComponent(query)}&limit=10`)
}

export function getBookInfo(id: string) {
    return apiAuthClient.get(`/books/${id}`);
}

export function getBookChapterList(id: string) {
    return apiAuthClient.get(`/books/${id}/chapters`);
}

export function getBookEpub(id: string) {
    return apiAuthClient.get(`/books/${id}`);
}

export function addBook(fileData: any, onUploadProgressEventListener: any) {
    return apiAuthClient.post("/books/add-book", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onUploadProgressEventListener
    });
}

export function confirmAddBook(id: string) {
    return apiAuthClient.post(`books/save-book/${id}`);
}

// --------------Analytics Data Collection----------------------
export function postReadHistory(id: string, history: any) {
    return apiAuthClient.post(`/books/${id}/update-read-history`, history);
}

export function postTestHistory(body: any) {
    return apiAuthClient.post("/books/update-quiz-test-history", body);
}

// ---------------ML-Task Controller----------------------------
export function getQuiz(id: string) {
    return apiAuthClient.get(`/main-ml/quiz/${id}`);
}

// -------------Passes through (Main-Service -> ML-Service)-------
export function postGenerateQuiz(body: any) {
    return apiAuthClient.post(`/main-ml/generate-quiz`, body);
}

export function getSummary(body: any) {
    return apiAuthClient.post(`/main-ml/generate-summary`, body);
}



// export async function getSimilarBooks(genre) {
//     const res = await apiClient.get(`user/books?genre=${encodeURIComponent(genre)}&limit=4`);
//     return res.data.map(item => new Book(item._id, item.title, item.author, item.genre, item.thumbnail));
// }
