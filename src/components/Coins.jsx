import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {server} from "../index"
import { Container, HStack, Button, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import CoinCard from './CoinCard';


const Coins = () => {

    const [coins,setCoins] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] =useState(false);
    const [page,setPage] = useState(1);
    const [currency,setCurrency] = useState("inr");

    const currencySymbol = currency==="inr"?"₹" : currency==="eur"?"€" : "$";

    const changePage = (page) => {
      setPage(page);
      setLoading(true);
    }
    // its just an initialization....
    const btns = new Array(132).fill(1);

  useEffect(() => {
    const fetchCoin = async()=>{
      try {
        const {data} = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`)

      setCoins(data);
      // console.log(data);
      setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCoin();
  }, [currency,page])

  if(error) return <ErrorComponent message={"error while fetching"}/>
  
  return (
    <Container maxW={"container.xl"}>
        {

        loading?<Loader/> : 
        <>

          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"eur"}>EUR</Radio>
              <Radio value={"usd"}>USD</Radio>

            </HStack>
          </RadioGroup>

          <HStack wrap={"wrap"} justifyContent={'space-evenly'}>
            {
              coins.map((i)=>(
                <CoinCard key={i.id} id={i.id} name={i.name} price={i.current_price} img={i.image} symbol={i.symbol} currencySymbol={currencySymbol} url={i.url}/>
              ))}
          </HStack>

          <HStack w={"full"} overflow={"auto"} padding={"8"}>
            {/* <Button bgColor={"blackAlpha.900"} color={"white"} onClick={()=>changePage(2)}>2</Button> */}

            {
              btns.map((item,index)=>(
                <Button key={index} bgColor={"blackAlpha.900"} color={"white"} onClick={()=>changePage(index+1)}>{index+1}</Button>
              ))
            }
          </HStack>
        </>
      }

    </Container>
  )
}



export default Coins