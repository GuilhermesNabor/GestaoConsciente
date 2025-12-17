
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Ticker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur,brl');
        const json = await response.json();
        const prices = [
          { id: '1', name: 'BTC', brl: json.bitcoin.brl, usd: json.bitcoin.usd, eur: json.bitcoin.eur },
          { id: '2', name: 'USD', brl: (1 / json.bitcoin.usd) * json.bitcoin.brl, usd: 1, eur: (1 / json.bitcoin.usd) * json.bitcoin.eur },
          { id: '3', name: 'EUR', brl: (1 / json.bitcoin.eur) * json.bitcoin.brl, usd: (1 / json.bitcoin.eur) * json.bitcoin.usd, eur: 1 },
        ];
        setData(prices);
      } catch (error) {
        setError('Error fetching prices');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (data.length + 1) % data.length;
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>BRL: {item.brl.toFixed(2)}</Text>
            <Text style={styles.price}>USD: {item.usd.toFixed(2)}</Text>
            <Text style={styles.price}>EUR: {item.eur.toFixed(2)}</Text>
          </View>
        )}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    width: screenWidth - 40,
  },
  item: {
    width: screenWidth - 40,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  price: {
    fontSize: 14,
    color: '#333333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Ticker;
