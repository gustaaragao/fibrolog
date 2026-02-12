import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PdfViewerProps {
  uri: string;
}

export default function PdfViewer({ uri }: PdfViewerProps) {
  return (
    <View style={styles.container}>
      <iframe
        src={uri}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="PDF Preview"
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
});
