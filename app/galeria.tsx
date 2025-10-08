import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, ImageBackground, Modal, Pressable, Image } from 'react-native';
import { getProducts, createProduct, type Product } from "../services/api";

type UiProduct = {
  id: string;
  title: string;
  description: string;
  image: { uri: string };
};

type ImgMode = 'cover' | 'contain' | 'stretch';


type ItemProps = {
  product: UiProduct;
  onPress: (p: UiProduct) => void;
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
  const [selected, setSelected] = useState<UiProduct | null>(null);
  const [visible, setVisible] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [imgMode, setImgMode] = useState<ImgMode>('cover');

  const [data, setData] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const [newOpen, setNewOpen] = useState(false);
const [newTitle, setNewTitle] = useState("");
const [newDesc, setNewDesc] = useState("");
const [newImage, setNewImage] = useState("");
const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {  //esto maneja la carga que hacia el useEffect
    let alive = true;
    try {
      setLoading(true);
      const products: Product[] = await getProducts();
      if (!alive) return;

      const items: UiProduct[] = products.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        image: { uri: p.image },
      }));

      setData(items);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      alive && setLoading(false);
    }
    return () => { alive = false; };
  }, [getProducts]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await load();
    })();
    return () => { alive = false; };
  }, [load]);

  const handleSave = useCallback(async () => {
    if (!newTitle.trim() || !newDesc.trim() || !newImage.trim()) {
      setError("Completá título, descripción e imagen");
      return;
    }
    setSaving(true);
    try {
      await createProduct({
        title: newTitle.trim(),
        description: newDesc.trim(),
        image: newImage.trim(),
      });
      setNewTitle("");
      setNewDesc("");
      setNewImage("");
      setNewOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  }, [newTitle, newDesc, newImage, load]);


  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(el => el.title.toLowerCase().includes(q));
  }, [query, data]);

  const openDetail = (p: UiProduct) => {
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

  if (loading) return <View style={styles.cargando}> <Text>Cargando…</Text> </View>;
  if (error) return <View style={styles.error}> <Text style={{color:'red'}}>{error}</Text> </View>;

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

      <Pressable
        onPress={() => setNewOpen(true)}
        style={styles.btnAgrProducto}
      >
        <Text style={styles.sumaAgrProducto}>＋</Text>
      </Pressable>

      
      <Modal visible={newOpen} animationType="slide" transparent onRequestClose={() => setNewOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setNewOpen(false)}>
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.tituloNuevoProducto}>Nuevo producto</Text>

            <View style={{ paddingHorizontal: 14 }}>
              <Text style={{ marginBottom: 4 }}>Título</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Ej: Mate Imperial"
                style={styles.bordeNuevoProducto}
              />

              <Text style={{ marginBottom: 4 }}>Descripción</Text>
              <TextInput
                value={newDesc}
                onChangeText={setNewDesc}
                placeholder="Ej: De calabaza forrada en cuero"
                multiline
                style={styles.bordeNuevoProducto}
              />

              <Text style={{ marginBottom: 4 }}>URL de imagen</Text>
              <TextInput
                value={newImage}
                onChangeText={setNewImage}
                placeholder="https://…"
                autoCapitalize="none"
                style={styles.bordeNuevoProducto}
              />
            </View>

            <View style={styles.modalNuevoProducto}>
              <Pressable onPress={() => (!saving && setNewOpen(false))} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={saving ? undefined : handleSave}
                style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: saving ? "#aaa" : "#0e3c50ff" }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>{saving ? "Guardando…" : "Guardar"}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>






    </View>
  );
}

const CARD_MAX_WIDTH = 560;

// -------------------------------------------------- CSS --------------------------------------------------

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

  cargando: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  error: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  btnAgrProducto: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  sumaAgrProducto: { color: "#fff", fontSize: 30, lineHeight: 28 },

  tituloNuevoProducto: { fontSize: 18, fontWeight: "700", margin: 14, textAlign: "center" },
  bordeNuevoProducto: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
  modalNuevoProducto: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginRight: 14, marginBottom: 12 },

});