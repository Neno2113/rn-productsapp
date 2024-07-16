
import { MainLayout } from "../../layouts/MainLayout"
import { useQuery } from "@tanstack/react-query"
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types"
import { RootStackParams } from "../../navigation/MainStack"
import { getProductById } from "../../../actions/products/get-product-by-id"
import { Button, ButtonGroup, Input, Layout, Text, useTheme } from "@ui-kitten/components"
import { useRef } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { FlatList } from "react-native"
import { FadeInImage } from "../../components/ui/FadeInImage"
import { Gender, Size } from "../../../domain/entities/product.entity"
import { MyIcon } from "../../components/ui/MyIcon"


const sizes: Size[] = [Size.Xs, Size.S, Size.L, Size.M, Size.Xl, Size.Xxl];
const genders: Gender[] = [ Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];


interface Props extends NativeStackScreenProps<RootStackParams, "ProductScreen">{}

export const ProductScreen = ({ route, navigation}:Props) => {

  const { params } = route;
  const productIdRef = useRef(params.productId);
  const theme = useTheme();

  const { isLoading, data: product }  = useQuery({
    queryKey: ['product', productIdRef.current],
    staleTime: 1000 * 60 * 60, // 1 hour,
    queryFn: () => getProductById(productIdRef.current),
  })

  if( !product) {
    return (
      <MainLayout title="Cargando...">
        <Text>Cargando... producto</Text>
      </MainLayout>
    )
  }

  
  return (
    <MainLayout
      title={product.title}
    >
      <ScrollView style={{ flex: 1, }}>
        {/* Imagenes del producto */}
        <Layout>
          <FlatList 
            data={ product.images}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={ false }
            renderItem={ ({ item }) => (
              <FadeInImage 
                uri={item}
                style={{ width: 300, height: 300, marginHorizontal: 7 }}
              />
            )}
          />
        </Layout>

        {/* Formulario */}

        <Layout style={{ marginHorizontal: 10}}>
          <Input 
            label="Titulo"
            value={ product.title }
            style={{ marginVertical: 5 }}
          />
          <Input 
            label="Slug"
            value={ product.slug }
            style={{ marginVertical: 5 }}
          />
          <Input 
            label="Descripcion"
            value={ product.description }
            multiline
            numberOfLines={5}
            style={{ marginVertical: 5 }}
          />
        </Layout>
        {/* Precio e inventario */}
        <Layout style={{ marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
          <Input 
            label="Precio"
            value={ product.price.toString() }
            style={{ flex: 1 }}
          />
          <Input 
            label="Inventario"
            value={ product.stock.toString() }
            style={{ flex: 1 }}
          />

        </Layout>

        <ButtonGroup appearance="outline" status="primary" style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }}>
            {
              sizes.map( s => (
                <Button 
                  key={s}
                  style={{ 
                    flex: 1,
                    backgroundColor: true ? theme['color-primary-300'] : undefined
                  }}
                >
                  {s}
                </Button>
              ))
            }
        </ButtonGroup>

        <ButtonGroup appearance="outline" status="primary" style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }}>
            {
              genders.map( g => (
                <Button 
                  key={g}
                  style={{ 
                    flex: 1,
                    backgroundColor: true ? theme['color-primary-300'] : undefined
                  }}
                >
                  {g}
                </Button>
              ))
            }
        </ButtonGroup>

        <Button
          onPress={ () => console.log("Guardar")}
          accessoryLeft={ <MyIcon name="save-outline" white />}
          style={{ margin: 15}}
        >
          Guardar
        </Button>
        <Text>{JSON.stringify(product, null, 2)}</Text>



        <Layout  style={{ height: 350}}/>

      </ScrollView>

    </MainLayout>

  )
}
