import React, {useEffect, useState} from 'react'
import SignIn from './login';
import { Button, Form, Input } from 'antd';
import { useAppDispatch } from 'store';
import { useTranslation } from 'react-i18next';
import './style.scss'
import Logo2 from '../../assets/images/logo-sarbon.svg'
import MainLoader from './loader';

const Login: React.FC = (): JSX.Element => {
  const [form] = Form.useForm();
  const {t} = useTranslation();
  const dispatch: any = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true)

  const onFinish = async (values: any) => {
    const formdata = new FormData();
    for (const [key, value] of Object.entries<any>(values)) {
      formdata.append(key, value)
    }
    const arg = {
      type: 'login',
      data: formdata
    }
    await dispatch(SignIn(arg));
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);

  }, [loading])

  if(loading) {
    return <MainLoader />
  }
  
  return (
    <>
      <div className="login-wrapper flex items-center justify-center h-screen p-4">
        <div className="shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)] max-w-6xl max-md:max-w-lg rounded-3xl p-6 bg-white">
        <img src={Logo2} className='w-[250px] mt-4' alt="" />

          <div className="grid md:grid-cols-2 items-center gap-8">
            <div className="max-md:order-1 lg:min-w-[450px] max-md:hidden">
              <img src="https://readymadeui.com/signin-image.webp" className="lg:w-11/12 w-full object-cover" alt="login-image" />
            </div>

            <div className="md:max-w-md w-full mx-auto">
              <div className="mb-6">
                <p className='text-[18px] mx-5 max-md:my-6 text-[#1A386A] font-medium'>Sarbon universitetining ta’lim jarayonlarini boshqarish axborot tizimi</p>
              </div>

              <Form form={form} layout='vertical' onFinish={onFinish} className='w-[100%] text-center'>
                <Form.Item
                  name="username"
                  label={<span className="label">{t("Username")}</span>}
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input name="text" type="text" className="e-input w-[100%]" placeholder={`${t("Input username")}...`} />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={<span className="label">{t("Password")}</span>}
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password name="password" type="password" className="e-input w-[100%]" placeholder={`${t("Input password")}...`} />
                </Form.Item>

                <Button block className=" mt-5 px-3 h-[40px]  text-[16px]" htmlType="submit" type='primary'>{t("Login")}</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      
      
      
      
      
      {/* <div className="login-wrapper">
        <div className="login-card e-card-shadow" >
          <div className='p-5 text-center my-auto bg-[#ffffff] rounded-[1rem] text-white h-[100%] w-[60%] login_title_card' style={{border: "2px solid #1A386A"}} >
            <img src={Logo2} className='lg:w-[300px] mt-12 w-[250px]' alt="" />
            <p className='text-[18px] mx-5 my-4 text-[#1A386A] font-medium'>Sarbon universitetining ta’lim jarayonlarini boshqarish axborot tizimi</p>
            <p className='text-[18px] mx-5 text-[#1A386A] font-medium'>Information system for management of educational processes Sarbon University</p>
          </div>
          <div className="login-card2">
            <Form form={form} layout='vertical' onFinish={onFinish} className='w-[100%] text-center'>
              <div className='mobile-login-logo'>
                <img src={Logo2} className='w-[120px]' alt="" />
                <p className='m-5'>Sarbon universitetining ta’lim jarayonlarini <br /> boshqarish axborot tizimi</p>
              </div>
              <Form.Item
                name="username"
                label={<span className="label">{t("Username")}</span>}
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input name="text" type="text" className="e-input w-[100%]" placeholder={`${t("Input username")}...`} />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="label">{t("Password")}</span>}
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password name="password" type="password" className="e-input w-[100%]" placeholder={`${t("Input password")}...`} />
              </Form.Item>
              <Button block className=" mt-5 px-3 h-[40px] bg-[var(--v-element)] text-[16px] text-[var(--v-text)] " htmlType="submit">{t("Login")}</Button>
            </Form>
          </div>
        </div>
      </div> */}
    </>
  )
}
export default Login