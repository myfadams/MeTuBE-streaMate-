import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { bgColor, loadingColor } from '../../constants/colors';
import { useLocalSearchParams } from 'expo-router';
import SearchFields from '../../components/SearchField';

const SearchView = () => {
    const pageName=useLocalSearchParams()
    console.log(pageName)
  return (
    <SafeAreaView style={{backgroundColor:bgColor,height:"100%", alignItems:"center"}}>
        <SearchFields name={pageName.SearchWord}/>
      <Text>SearchView</Text>
    </SafeAreaView>
  )
}

export default SearchView