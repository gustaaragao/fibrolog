import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

interface PdfViewerProps {
  uri: string;
}

export default function PdfViewer({ uri }: PdfViewerProps) {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        style={styles.pdf}
        onError={(error) => {
          console.error('PdfViewer Error:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});
