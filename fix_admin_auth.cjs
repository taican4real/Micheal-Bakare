const fs = require('fs');
let content = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

// Need to import doc, getDoc, db
if (!content.includes('import { doc, getDoc }')) {
  content = content.replace("import { onAuthStateChanged, User } from 'firebase/auth';", "import { onAuthStateChanged, User } from 'firebase/auth';\nimport { doc, getDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';");
}

// Update the useEffect
const oldEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);`;

const newEffect = `  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === 'taican4real@gmail.com') {
          setIsAuthorized(true);
          setLoading(false);
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setIsAuthorized(true);
            } else {
              setAuthError("Unauthorized. Your account does not have admin privileges.");
              setIsAuthorized(false);
            }
          } catch (e) {
            setAuthError("Unauthorized or missing permissions.");
            setIsAuthorized(false);
          }
          setLoading(false);
        }
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);`;

content = content.replace(oldEffect, newEffect);

// Update the render condition
content = content.replace('if (!user) {', 'if (!user || !isAuthorized) {');

// Add error message to login screen
content = content.replace('<p className="text-ink-muted mb-8">Please sign in to access the dashboard.</p>', '{authError ? <p className="text-red-600 mb-8">{authError}</p> : <p className="text-ink-muted mb-8">Please sign in to access the dashboard.</p>}');

fs.writeFileSync('src/layouts/AdminLayout.tsx', content);
