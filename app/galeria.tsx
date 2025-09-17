import React, { useMemo, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, ImageBackground, Modal, Pressable, Image } from 'react-native';

type Product = {
  id: string;
  title: string;
  description: string;
  image: { uri: string } | number;
};

type ImgMode = 'cover' | 'contain' | 'stretch';

const DATA: Product[] = [
{ id: '1', title: 'Pan',  description: 'Pan fresco de masa madre, corteza crujiente.', image: require('../assets/images/pan.jpg')  },
{ id: '2', title: 'Leche', description: 'Leche entera pasteurizada, 1 litro.', image: require('../assets/images/leche.jpg') },
{ id: '3', title: 'Huevos', description: 'Docena de huevos de campo.', image: require('../assets/images/huevos.jpg') },
{ id: '4', title: 'Arroz', description: '1kg de arroz de primera calidad.', image: require('../assets/images/arroz.jpg') },
{ id: '5', title: 'Pasta', description: 'Medio kilo de pasta italiana, fresca y sabrosa.', image: require('../assets/images/pasta.jpg') },
{ id: '6', title: 'Pollo', description: 'Un pollo para deshuesar y aprovechar todas sus partes.', image: require('../assets/images/pollo.jpg') },
{ id: '7', title: 'Carne', description: 'La carne más jugosa y sabrosa que podes conseguir.', image: require('../assets/images/carne.jpg')},
{ id: '8', title: 'Manzana', description: 'Las manzanas más frescas del mercado.', image: { uri: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce' } },
{ id: '9', title: 'Banana', description: 'Las bananas más ricas recien traidas de Ecuador.', image: require('../assets/images/banana.jpg') },
{ id: '10', title: 'Sal', description: 'Una sal que sala de verdad.', image: { uri: 'https://images.unsplash.com/photo-1634612831148-03a8550e1d52' } },
{ id: '11', title: 'Azúcar', description: 'Azúcar refinada que endulza sin pelear.', image: { uri: 'https://images.unsplash.com/photo-1709651808265-977ed7ef78c6' } },
{ id: '12', title: 'Pimienta', description: 'Pimienta negra que despierta sabores.', image: { uri: 'https://plus.unsplash.com/premium_photo-1668447605666-716a18e15a1d' } },
{ id: '13', title: 'Harina', description: 'Harina 0000 lista para tus masas.', image: { uri: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9' } },
{ id: '14', title: 'Aceite de oliva', description: 'Extra virgen, frutado y honesto.', image: { uri: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5' } },
{ id: '15', title: 'Café', description: 'Granos tostados, aroma que te despierta.', image: { uri: 'https://images.unsplash.com/photo-1606486544554-164d98da4889' } },

];

type ItemProps = {
  product: Product;
  onPress: (p: Product) => void;
  isFavorite: boolean;
  onLongPress: (id: string) => void;
};

const Item = ({ product, onPress, isFavorite, onLongPress }: ItemProps) => (
  <Pressable
    onPress={() => onPress(product)}
    onLongPress={() => onLongPress(product.id)}
    delayLongPress={300}
  >
    <ImageBackground
      source={product.image}
      style={styles.itemBg}
      imageStyle={styles.itemBgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      {isFavorite && (
        <View style={styles.favBadge}>
          <Text style={styles.favStar}>★</Text>
        </View>
      )}
      <Text style={styles.title}>{product.title}</Text>
    </ImageBackground>
  </Pressable>
);

export default function Galeria() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [visible, setVisible] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [imgMode, setImgMode] = useState<ImgMode>('cover');

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DATA;
    return DATA.filter(el => el.title.toLowerCase().includes(q));
  }, [query]);

  const openDetail = (p: Product) => {
    setSelected(p);
    setVisible(true);
  };

  const closeDetail = () => {
    setVisible(false);
    setTimeout(() => setSelected(null), 150);
  };

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const MODES: ImgMode[] = ['cover', 'contain', 'stretch'];

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Item product={item} onPress={openDetail} isFavorite={favoriteIds.has(item.id)} onLongPress={toggleFavorite}/>}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar..."
            autoCorrect={false}
            style={styles.input}
          />
        }
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        ListEmptyComponent={<Text style={styles.noItem}>No hay resultados para “{query}”.</Text>}
      />

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={closeDetail}
      >
        <Pressable style={styles.backdrop} onPress={closeDetail}>
          <Pressable style={styles.card} onPress={() => { }}>
            {selected && (
              <>
                <Image source={selected.image} style={styles.hero} resizeMode={imgMode}
                />

                <View style={styles.modeRow}>
                  {MODES.map(mode => {
                    const active = imgMode === mode;
                    return (
                      <Pressable
                        key={mode}
                        style={[styles.modeBtn, active && styles.modeBtnActive]}
                        onPress={() => setImgMode(mode)}
                      >
                        <Text style={[styles.modeTxt, active && styles.modeTxtActive]}>
                          {mode}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{selected.title}</Text>
                  <Text style={[styles.favStar, { fontSize: 22, marginLeft: 8, opacity: favoriteIds.has(selected.id) ? 1 : 0.2 }]}>
                    ★
                  </Text>
                </View>
                <Text style={styles.cardDesc}>{selected.description}</Text>

                <Pressable style={styles.closeBtn} onPress={closeDetail}>
                  <Text style={styles.closeTxt}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const CARD_MAX_WIDTH = 560;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a4c4daff',
    paddingTop: 40,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 5,
  },
  itemBg: {
    height: 140,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'flex-start',
  },
  itemBgImage: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '600',
  },
  noItem: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.6,
  },

  favBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 5,
    elevation: 2,
  },
  favStar: {
    fontSize: 20,
    color: '#f1c31bff',
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    alignItems: "center"
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  hero: {
    width: '100%',
    height: 260,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    marginHorizontal: 14,
    opacity: 0.85,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 14,
    backgroundColor: '#0e3c50ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeTxt: {
    color: 'white',
    fontWeight: '600',
  },

  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
  },
  modeBtnActive: {
    backgroundColor: '#0e3c50ff',
  },
  modeTxt: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modeTxtActive: {
    color: 'white',
  },
});