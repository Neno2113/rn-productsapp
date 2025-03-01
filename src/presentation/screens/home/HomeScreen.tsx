
import { Button, Icon, Layout, Text } from "@ui-kitten/components"
import { useAuthStore } from "../../store/auth/useAuthStore"
import { getProductsByPage } from "../../../actions/products/get-products-by-page";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { ProductList } from "../../components/prodcuts/ProductList";
import { FAB } from "../../components/ui/FAB";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/MainStack";

export const HomeScreen = () => {

  const { logout } = useAuthStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // const { isLoading, data: products = []} = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, // 1 hour
  //   queryFn: () => getProductsByPage(0),
  // })

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: 0,

    queryFn: async( params ) => {
      console.log(params);
      return await getProductsByPage(params.pageParam)
      
    },
    getNextPageParam: ( lastPage, allPages) => allPages.length
  })

  return (
    <>
      <MainLayout 
        title="TesloShop - Products"
        subtitle="Aplicacion administrativa"
      >
        {
          isLoading ? ( <FullScreenLoader />) 
          : <ProductList 
              products={data?.pages.flat() ?? []} 
              fetchNextPage={ fetchNextPage }
            />
        }

      </MainLayout>
      <FAB 
        onPress={ () => navigation.navigate('ProductScreen', { productId: 'new'})} 
        iconName="plus-outline"
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
      />
    </>
  )
}
