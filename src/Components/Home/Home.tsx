import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

function Home() {
    return (
        <div>
            <div className="flex justify-center items-center" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/Stock.jpg)`,
                height: '40rem'
            }}>
                <motion.div
                    whileHover={{
                        scale: 1.1,
                    }}
                    drag
                    dragConstraints={{
                        top: -50,
                        left: -200,
                        right: 200,
                        bottom: 80,
                    }}
                    initial={{
                        backdropFilter: 'blur(12px) sepia(50%)',
                        translateX: -15
                    }}
                    animate={{
                        backdropFilter: 'blur(0px) sepia(0%)',
                        translateX: 0,
                        transition: {
                            duration: 0.5,
                            type: 'tween',
                            delay: 0.5
                        }
                    }}
                    className="border-gray-200/50 border p-5 rounded-md cursor-pointer">
                    <motion.h1
                        initial={{
                            backdropFilter: 'blur(12px) sepia(50%)',
                            color: '#000000'
                        }}
                        animate={{
                            backdropFilter: 'blur(0px) sepia(0%)',
                            color: '#FFFFFF'
                        }}
                        transition={{
                            duration: 3,
                            type: 'tween',
                            delay: 1
                        }}
                        className="font-bold"><FontAwesomeIcon icon={faMoneyBillTrendUp} className='text-green-600' /> Stock Market APP</motion.h1>
                </motion.div>
            </div>
        </div>
    )
}

export default Home;