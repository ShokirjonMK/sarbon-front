import './style.scss'
import Logo from '../../assets/images/logo-sarbon.svg'


const MainLoader = () => {

    return (
        <div className='absolute z-10 bg-white top-0 right-0 left-0 bottom-0'>
            <div className='flex h-[80vh] items-center justify-center p-5 m-auto' >
                <div className='p-5 loader-main flex' style={{borderRight: "5px #1F386A dotted", borderLeft: "5px #1F386A dotted"}}>
                    <img src={Logo} className='w-[100%] mx-auto' alt="" />
                </div>
            </div>
        </div>
    )
}
export default MainLoader;