import { auth, signOut } from "@/use-cases/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="container">
      <h1>Workouts</h1>
      <div>
        {session ? (
          <div>
            <span>{session.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </div>
        ) : (
          <span>Not signed in</span>
        )}
      </div>
    </div>
  );
}
