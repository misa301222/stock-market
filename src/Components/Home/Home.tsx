import { faCircleInfo, faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Home() {
    const [isManageStocksModalOpen, setIsManageStocksModalOpen] = useState<boolean>(false);
    const [isBuyStocksModalOpen, setIsBuyStocksModalOpen] = useState<boolean>(false);
    const [isCreateStocksModalOpen, setIsCreateStocksModalOpen] = useState<boolean>(false);
    const [isSellStocksModalOpen, setIsSellStocksModalOpen] = useState<boolean>(false);

    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

    const handleOnClickOpenModal = (title: string) => {
        switch (title) {
            case 'Manage Stocks':
                setIsManageStocksModalOpen(true);
                break;
        }

    }

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

            <div className='mt-40'>
                <h1 className='font-bold'>Welcome to Stock Market</h1>
                <hr />

                <motion.div
                    initial={{
                        backdropFilter: 'blur(12px) sepia(50%)',
                        translateX: -15,
                        opacity: 0
                    }}
                    animate={{
                        backdropFilter: 'blur(0px) sepia(0%)',
                        translateX: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.5,
                            type: 'tween',
                            delay: 1
                        }
                    }}
                    className='card mt-20'>
                    <div className='flex'>
                        <div className='w-1/2'>
                            <img src='/images/stockUp.jpg' />
                        </div>

                        <div className='w-1/2'>
                            <div className='p-5'>
                                <h3 className='font-bold'>Always Up <FontAwesomeIcon icon={faMoneyBillTrendUp} /></h3>
                                <hr className='w-3/4 mx-auto' />

                                <div className='mt-5 p-5'>
                                    <p className='text-justify'>In this App you can buy, create and sell stocks. You also count with advance tools to help manage your money. <br />
                                        Explore
                                        different stocks and buy whatever you feel is going to explode.
                                    </p></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className='bg-black/90 h-[55rem] mt-60 text-white font-bold'>
                <div className='h-full flex justify-evenly items-center'>
                    <motion.h1
                        initial={{
                            opacity: 0.2
                        }}

                        whileInView={{
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                duration: 2
                            }
                        }}
                        viewport={{
                            once: true
                        }}

                        whileHover={{
                            scale: 1.2
                        }}
                        onClick={() => handleOnClickOpenModal('Manage Stocks')}
                        className='cursor-pointer hover:text-blue-500 duration-150'>Manage Stocks</motion.h1>
                    <motion.h1
                        initial={{
                            opacity: 0.2
                        }}

                        whileInView={{
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                duration: 2,
                                delay: 1.8
                            }
                        }}
                        viewport={{
                            once: true
                        }}

                        whileHover={{
                            scale: 1.2
                        }}
                        onClick={() => handleOnClickOpenModal('Buy Stocks')}
                        className='cursor-pointer hover:text-blue-500 duration-150'
                    >Buy Stocks</motion.h1>
                    <motion.h1
                        initial={{
                            opacity: 0.2
                        }}

                        whileInView={{
                            opacity: 1,
                            translateY: [0, -30, 0],
                            transition: {
                                type: 'spring',
                                duration: 2,
                                delay: 3
                            }
                        }}
                        viewport={{
                            once: true
                        }}
                    ><FontAwesomeIcon className='text-green-500' icon={faMoneyBillTrendUp} /></motion.h1>
                    <motion.h1
                        initial={{
                            opacity: 0.2
                        }}

                        whileInView={{
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                duration: 2,
                                delay: 2.5
                            }
                        }}
                        viewport={{
                            once: true
                        }}

                        whileHover={{
                            scale: 1.2
                        }}
                        onClick={() => handleOnClickOpenModal('Create Stocks')}
                        className='cursor-pointer hover:text-blue-500 duration-150'
                    >Create Stocks</motion.h1>
                    <motion.h1
                        initial={{
                            opacity: 0.2
                        }}

                        whileInView={{
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                duration: 2,
                                delay: 1
                            }
                        }}
                        viewport={{
                            once: true
                        }}

                        whileHover={{
                            scale: 1.2
                        }}
                        className='cursor-pointer hover:text-blue-500 duration-150'
                        onClick={() => handleOnClickOpenModal('Sell Stocks')}
                    >Sell Stocks</motion.h1>
                </div>
            </div>

            <motion.div
                animate={isManageStocksModalOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Manage Stocks <FontAwesomeIcon icon={faCircleInfo} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsManageStocksModalOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">

                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">
                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsManageStocksModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Home;