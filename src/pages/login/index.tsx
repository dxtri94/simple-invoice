import {Button, Form, Input, notification} from 'antd'
import {useRouter} from 'next/router'
import {useCallback, useState} from "react";
import styles from './Login.module.scss'
import authServices from "@/services/auth";
import {setCookies} from "@/utils/cookies";
import {KEY_ACCESS_TOKEN, KEY_ORG_TOKEN, KEY_USER} from "@/constants/common";
import type {Container, Engine} from "tsparticles-engine";
import Particles from "react-particles";
import {loadFull} from "tsparticles";


// @ts-nocheck
const Login = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);

      const {data, error} = await authServices.login({
        username: values?.username,
        password: values?.password
      });

      if (data?.access_token) {
        await setCookies(KEY_ACCESS_TOKEN, {[KEY_ACCESS_TOKEN]: data?.access_token}, data?.expires_in);
        const {data: dataMembership, error: errMembership} = await authServices.getMembership();

        if (dataMembership) {
          await setCookies(KEY_USER, dataMembership, data?.expires_in);
          await setCookies(KEY_ORG_TOKEN, {[KEY_ORG_TOKEN]: dataMembership?.data?.memberships[0]?.token}, data?.expires_in);
          setIsLoading(false);
          router.back();

        } else {
          setIsLoading(false);
          notification.error({
            message: 'Login Failed',
            description: `${errMembership}`,
          });
        }

      } else {
        setIsLoading(false);
        notification.error({
          message: 'Login Failed',
          description: `${error}`,
        });
      }

    } catch (e) {
      console.log(e);
      setIsLoading(false);
      notification.error({
        message: 'Login Failed',
        description: `${e}`,
      });
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
  }, []);

  return (
    <div className={styles.loginContainer}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0d47a1",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: {min: 1, max: 5},
            },
          },
          detectRetina: true,
        }}
      />
      <div className={styles.loginBox}>
        <h1>Welcome back, </h1>
        <Form
          name="login"
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          initialValues={{remember: true}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {type: 'email', message: 'The input is not valid E-mail!',},
              {required: true, message: 'Please input your username!'}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: 'Please input your password!'}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>
      </div>

    </div>
  )
}

export default Login
