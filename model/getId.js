function getId() {
  const d = new Date()
  const date = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ms = d.getMilliseconds()
  const num = Math.ceil(Math.random() * 1000)
  const id = `${date}${hours}${minutes}${seconds}${ms}${num}`
  return id
}

module.exports = getId