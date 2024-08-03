
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types"
import { Button, ButtonGroup, Input, Layout, Text, useTheme } from "@ui-kitten/components"
import { ScrollView } from "react-native-gesture-handler"
import { Formik } from "formik"

import { RootStackParams } from "../../navigation/MainStack"
import { Product } from '../../../domain/entities/product.entity';

import { MainLayout } from "../../layouts/MainLayout"
import { MyIcon } from "../../components/ui/MyIcon"
import { ProductImages } from "../../components/prodcuts/ProductImages"
import { getProductById, updateCreateProduct } from "../../../actions"


;
import { genders, sizes } from "../../../config/constants/product.constant"
import { CameraAdapter } from "../../../config/adapter/camera-adapter"


interface Props extends NativeStackScreenProps<RootStackParams, "ProductScreen">{}

export const ProductScreen = ({ route, navigation}:Props) => {

  const { params } = route;
  const productIdRef = useRef(params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { isLoading, data: product }  = useQuery({
    queryKey: ['product', productIdRef.current],
    staleTime: 1000 * 60 * 60, // 1 hour,
    queryFn: () => getProductById(productIdRef.current),
  })


  const mutation = useMutation({
    mutationFn: ( data: Product) => updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id; // creacion de producto


      queryClient.invalidateQueries({ queryKey:  ['products', 'infinite']});
      queryClient.invalidateQueries({ queryKey:  ['product', data.id]});
      // queryClient.setQueryData(['product', data.id], data);
      
    },
  })


  if( !product) {
    return (
      <MainLayout title="Cargando...">
        <Text>Cargando... producto</Text>
      </MainLayout>
    )
  }

  
  return (
    <Formik
      initialValues={ product}
      onSubmit={ (values) => mutation.mutate(values) }
    >
      {
        ({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
          <MainLayout
            title={values.title}
            subtitle={`Precio - ${values.price}`}
            rightAction={async () => {
              // const photos = await CameraAdapter.takePicture();
              const photos = await CameraAdapter.getPinctureFromGallery();
              setFieldValue('images', [ ...values.images, ...photos]);
              console.log(photos);
              
            }}
            rightActionIcon="image-outline"
          >
            <ScrollView style={{ flex: 1, }}>
              {/* Imagenes del producto */}
              <Layout>
                <ProductImages images={ values.images } />
              </Layout>

              {/* Formulario */}

              <Layout style={{ marginHorizontal: 10}}>
                <Input 
                  label="Titulo"
                  value={ values.title }
                  onChangeText={ handleChange('title') }
                  style={{ marginVertical: 5 }}
                />
                <Input 
                  label="Slug"
                  value={ values.slug }
                  onChangeText={ handleChange('slug') }
                  style={{ marginVertical: 5 }}
                />
                <Input 
                  label="Descripcion"
                  value={ values.description }
                  onChangeText={ handleChange('description') }
                  multiline
                  numberOfLines={5}
                  style={{ marginVertical: 5 }}
                />
              </Layout>
              {/* Precio e inventario */}
              <Layout style={{ marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
                <Input 
                  label="Precio"
                  value={ values.price.toString() }
                  onChangeText={ handleChange('price') }
                  keyboardType="numeric"
                  style={{ flex: 1 }}
                />
                <Input 
                  label="Inventario"
                  keyboardType="number-pad"
                  value={ values.stock.toString() }
                  onChangeText={ handleChange('stock') }
                  style={{ flex: 1 }}
                />

              </Layout>

              <ButtonGroup appearance="outline" status="primary" style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }}>
                  {
                    sizes.map( s => (
                      <Button 
                        onPress={ () => setFieldValue('sizes', 
                          values.sizes.includes(s)
                          ? values.sizes.filter( size => size !== s)
                          : [ ...values.sizes, s]
                        )}
                        key={s}
                        style={{ 
                          flex: 1,
                          backgroundColor: values.sizes.includes(s) 
                          ? theme['color-primary-200'] 
                          : undefined
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
                        onPress={ () => setFieldValue('gender', g)}
                        key={g}
                        style={{ 
                          flex: 1,
                          backgroundColor: values.gender.startsWith(g)
                          ? theme['color-primary-200'] 
                          : undefined
                        }}
                      >
                        {g}
                      </Button>
                    ))
                  }
              </ButtonGroup>

              <Button
                onPress={ () => handleSubmit() }
                accessoryLeft={ <MyIcon name="save-outline" white />}
                style={{ margin: 15}}
                disabled={ mutation.isPending}
              >
                Guardar
              </Button>
              <Text>{JSON.stringify(values, null, 2)}</Text>



              <Layout  style={{ height: 350}}/>

            </ScrollView>

          </MainLayout>
        )
      }
    </Formik>

  )
}
