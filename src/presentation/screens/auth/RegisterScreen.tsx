
import { Button, Input, Layout, Text } from "@ui-kitten/components"
import { ScrollView, useWindowDimensions } from "react-native"
import { MyIcon } from "../../components/ui/MyIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/MainStack";


interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ({ navigation }: Props) => {

  const { height } = useWindowDimensions();

  return (
    <Layout style={{ flex: 1}}>
      <ScrollView  style={{ marginHorizontal: 40}}>

        <Layout style={{ paddingTop: height *0.30}}>
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, create una cuenta para continuar</Text>
        </Layout>

        <Layout style={{ marginTop: 20}}>
         <Input 
            placeholder="Nombre completo"
            style={{ marginBottom: 10 }}
            accessoryLeft={ <MyIcon name="person-outline" />}
          />
          <Input 
            placeholder="Correo electronico"
            style={{ marginBottom: 10 }}
            keyboardType="email-address"
            accessoryLeft={ <MyIcon name="email-outline" />}
            autoCapitalize="none"
          />
          <Input 
            placeholder="Contrasena"
            style={{ marginBottom: 20 }}
            accessoryLeft={ <MyIcon name="lock-outline" />}
            secureTextEntry
            autoCapitalize="none"
          />
          <Layout style={{ height: 10}} />

          <Layout>
            <Button
              onPress={ () => {}}
              accessoryRight={ <MyIcon name="arrow-forward-outline" />}
              style={{}}
            >
              Crear
            </Button>
            
          </Layout>
          <Layout style={{ height: 50}} />

          <Layout style={{ alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'center'}}>
            <Text >Ya tienes una cuenta?</Text>
            <Text 
              status="primary"
               category="s1"
               onPress={ () => navigation.pop()}
              > 
              {'  '}
              Ingresar{' '}
            </Text>
          </Layout>


        </Layout>

      </ScrollView>
    </Layout>
   
  )
}
