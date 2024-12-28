import { TypeAnimation } from "react-type-animation"

const TextAnimationWrap = ({ text = "Hello World!", delay = 1000, wrapper = "span", speed = 25, className, repeat = "infinity", style = { fontSize: '2em' } }) => {

  return (
    <TypeAnimation
      sequence={[
        text,
        delay
      ]}
      wrapper={wrapper}
      speed={speed}
      className={className}
      repeat={repeat}//0, 3, infinity
    />
  )

}

export default TextAnimationWrap;