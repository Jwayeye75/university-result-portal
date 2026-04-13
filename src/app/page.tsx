export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-white via-green-50/30 to-white">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎓</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Student Result System</h1>
        <p className="text-success font-medium">System initialized successfully.</p>
      </div>
    </main>
  );
}