import React from 'react'

const Badge = (props: {text: string}) => {
  const text = props.text
  return (
    <div className={(text == "wedding" ? "wd" : "rb") + " text-xs px-4 text-white py-1 rounded-full"}>{text}</div>
  )
}

export default Badge