import {
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios, { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BottomError from "../../components/auth/BottomError";
import { Errors } from "../../lib/types";

interface LoginValues {
  identifier: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [errors, setErrors] = useState<
    Errors<"provider" | "identifier" | "password">
  >({
    provider: null,
    identifier: null,
    password: null,
  });

  const form = useForm<LoginValues>({
    validate: {
      identifier: (value: string) => (value === "" ? "Required*" : null),
      password: (value: string) =>
        value === ""
          ? "Required*"
          : value.length < 6
          ? "Password must be at least 6 characters"
          : null,
    },
    initialValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login",
        values
      );

      const { token } = res.data.data;
      router.push(`/api/auth/cookie?token=${token}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data.data.errors;

        if (error === "Password is Invalid") {
          setErrors(() => ({
            password: "Invalid Password",
            identifier: null,
            provider: null,
          }));
        } else if (error === "User not found") {
          setErrors(() => ({
            password: null,
            identifier: "User not found",
            provider: null,
          }));
        } else if (error === "Sign in with a different provider") {
          setErrors(() => ({
            password: null,
            identifier: null,
            provider: "Try logging in with Google",
          }));
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login | Hurtle</title>
      </Head>
      <Box mx="auto">
        <Stack>
          <Text size="xl" weight="600">
            Login
          </Text>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack spacing="lg">
              <Button
                variant="outline"
                component={Link}
                href={process.env.NEXT_PUBLIC_SERVER_URL + "/auth/google"}
              >
                <Group>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                    height={20}
                  />
                  <Text>Login with Google</Text>
                </Group>
              </Button>

              <TextInput
                withAsterisk
                label="Email or Username"
                placeholder=""
                {...form.getInputProps("identifier")}
              />

              <TextInput
                withAsterisk
                label="Password"
                type="password"
                {...form.getInputProps("password")}
              />
            </Stack>
            <Group mt="md">
              <Button type="submit">Submit</Button>
              <Anchor component={Link} href="/auth/register">
                {"Don't have an account? Register"}
              </Anchor>
            </Group>
            {errors.identifier && <BottomError message={errors.identifier} />}
            {errors.password && <BottomError message={errors.password} />}
            {errors.provider && <BottomError message={errors.provider} />}
          </form>
        </Stack>
      </Box>
    </>
  );
}
