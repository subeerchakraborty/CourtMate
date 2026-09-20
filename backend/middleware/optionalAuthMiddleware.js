import getFirebaseAdminAuth from "../config/firebaseAdmin.js";

async function optionalAuth(request, response, next) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return next();

  try {
    const idToken = authorization.slice("Bearer ".length).trim();
    if (idToken) request.firebaseUser = await getFirebaseAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.warn("Optional authentication skipped:", error.code || error.message);
  }

  return next();
}

export default optionalAuth;
