export default function Home() {
  const ping = async() => {
    fetch('/api/v1/ping')
  }

  return (
    <div onClick={ping}>ping</div>
  )
}
