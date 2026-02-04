export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          <span className="text-gradient bg-gradient-to-r from-primary-500 to-primary-700">
            StudyMate
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          AI와 함께하는 스마트 학습. 개인화된 학습 계획, 진도 관리, 취약점 분석으로 효율적인 학습을
          도와드립니다.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/login"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            시작하기
          </a>
          <a
            href="/about"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            더 알아보기 <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  )
}
