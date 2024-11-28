import { AnimatePresence, motion } from "framer-motion"

const ButtonWrapper = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default ButtonWrapper;