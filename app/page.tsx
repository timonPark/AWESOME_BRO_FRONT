import SignInButton from "./components/SignInButton";

function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-5xl font-semibold'>AWESOME-BRO</h1>
      <SignInButton />
    </main>
  )
}

export default Home;
