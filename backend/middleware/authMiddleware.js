import getFirebaseAdminAuth from "../config/firebaseAdmin.js";

async function requireAuth(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication token is required" });
  }

  const idToken = authorization.slice("Bearer ".length).trim();

  if (!idToken) {
    return response.status(401).json({
      message: "Authentication token is empty",
      code: "auth/missing-token",
    });
  }

  console.log(
    `[Auth] token shape: length=${idToken.length}, segments=${idToken.split(".").length}`,
  );

  try {
    request.firebaseUser = await getFirebaseAdminAuth().verifyIdToken(idToken);
    return next();
  } catch (error) {
    const errorCode = error.code || "auth/unknown-verification-error";

    console.error("Firebase token verification failed:", errorCode);
    return response.status(401).json({
      message: "Invalid or expired authentication token",
      code: errorCode,
    });
  }
}

export default requireAuth;
