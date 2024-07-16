
import { Button, Input, Layout, Text } from "@ui-kitten/components"
import { Alert, ScrollView, useWindowDimensions } from "react-native"
import { MyIcon } from "../../components/ui/MyIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/MainStack";
import { useState } from "react";
import { useAuthStore } from "../../store/auth/useAuthStore";


interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {

}

export const LoginScreen = ({ navigation }: Props) => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const { height } = useWindowDimensions();
  const { login } = useAuthStore();
  const [ isLoading, setIsLoading ] = useState(false);


  const onLogin =async () => {
    if ( form.email.length === 0 || form.password.length === 0){
      return;
    }
    setIsLoading(true);

    const wasSuccessful = await login(form.email, form.password)
    setIsLoading(false);
    if( wasSuccessful ) return;

    Alert.alert('Error', 'Usuario o contrasena incorrectos');
  }


  return (
    <Layout style={{ flex: 1}}>
      <ScrollView  style={{ marginHorizontal: 40}}>

        <Layout style={{ paddingTop: height *0.35}}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingrese para continuar</Text>
        </Layout>

        <Layout style={{ marginTop: 20}}>
          <Input 
            placeholder="Correo electronico"
            style={{ marginBottom: 10 }}
            keyboardType="email-address"
            accessoryLeft={ <MyIcon name="email-outline" />}
            autoCapitalize="none"
            value={ form.email}
            onChangeText={ value => setForm({ ...form, email: value})}
          />
          <Input 
            placeholder="Contrasena"
            style={{ marginBottom: 20 }}
            accessoryLeft={ <MyIcon name="lock-outline" />}
            secureTextEntry
            autoCapitalize="none"
            value={ form.password}
            onChangeText={ value => setForm({ ...form, password: value })}
          />
          <Layout style={{ height: 10}} />

          <Layout>
            <Button
              onPress={ onLogin }
              disabled={ isLoading}
              accessoryRight={ <MyIcon name="arrow-forward-outline" />}
              style={{}}
            >
              Ingresar
            </Button>
            
          </Layout>
          <Layout style={{ height: 50}} />

          <Layout style={{ alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'center'}}>
            <Text >No tienes cuenta?</Text>
            <Text 
              status="primary"
               category="s1"
               onPress={ () => navigation.navigate('RegisterScreen')}
              > 
              {'  '}
              crea una{' '}
            </Text>

          </Layout>

          {/* <Text>{JSON.stringify(form, null, 2)}</Text> */}

        </Layout>

      </ScrollView>
    </Layout>
   
  )
}
