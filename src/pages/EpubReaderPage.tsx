import {
  Box,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { Contents, Location, Rendition } from 'epubjs';
import {
  Maximize,
  Minimize,
  Minus,
  Moon,
  Plus,
  Sun,
  Volume2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ReactReader } from 'react-reader';
import { useParams } from 'react-router-dom';
// import apiClient from '../utils/apiClient';
// import ProgressUI from './ProgressUI';
import { getBookEpub, postReadHistory } from '@/api/ApiRequests';
import ProgressUI from '@/components/ProgressUI';
import { BookInfo } from '../types/bookInfo';

export default function EpubReaderPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookInfo | null>(null);
  const [location, setLocation] = useState<string | number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(100);
  const [selectedText, setSelectedText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const renditionRef = useRef<Rendition>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<{ [x: string]: number }>(null);
  const pageIndex = useRef<number>(0);

  //   const toast = useToast();

  useEffect(() => {
    const fetchBook = async (id: string) => {
      if (!id || id.length === 0) return;

      try {
        const response = await getBookEpub(id);
        const data = response.data;
        setBook(data);
        setTotalPages(data.pageCount || 0);
      } catch (error) {
        console.error('Error fetching book:', error);
        // toast({
        //   title: 'Error loading book',
        //   status: 'error',
        //   duration: 3000,
        //   isClosable: true,
        // });
      }
    };

    if (bookId) {
      fetchBook(bookId);
    }

    const id = setInterval(() => {
      updateReadHistory(pageIndex.current);
    }, 15000);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        exitFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => {
      const newSize = Math.max(50, Math.min(200, prev + delta));
      if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${newSize}%`);
      }
      return newSize;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (renditionRef.current) {
        renditionRef.current.themes.register(newMode ? 'dark' : 'light', {
          body: {
            color: newMode ? '#ffffff !important' : '#000000 !important',
            background: newMode ? '#1a202c !important' : '#ffffff !important',
          },
        });
        renditionRef.current.themes.select(newMode ? 'dark' : 'light');
      }
      return newMode;
    });
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      exitFullScreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullScreen(false);
  };

  const speak = (text: string) => {
    if (!text) {
      //   toast({
      //     title: 'No text selected',
      //     description: 'Please select text to use text-to-speech',
      //     status: 'info',
      //     duration: 2000,
      //   });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

    // toast({
    //   title: 'Text-to-speech activated',
    //   status: 'success',
    //   duration: 1000,
    // });
  };

  const updateReadHistory = async (pageIdx: number) => {
    if (!bookId) return;

    try {
      const res = await postReadHistory(bookId, {
        pageIdx: pageIdx,
        time: new Date().toISOString()
      });
      console.log('Read history updated:', res.data);
    } catch (error) {
      console.error('Error updating read history:', error);
    }
  };

  return (
    <Box
      ref={containerRef}
      display="flex"
      flexDir="column"
      h="100vh"
      w="full"
      overflow="hidden"
      bg={isDarkMode ? 'gray.900' : 'white'}
      color={isDarkMode ? 'white' : 'black'}
    >
      {/* Header */}
      <Flex
        as="header"
        bg={isDarkMode ? 'gray.800' : 'gray.100'}
        color={isDarkMode ? 'white' : 'gray.800'}
        p={4}
        justify="space-between"
        align="center"
      >
        <Heading as="h1" size="lg" truncate>
          {book?.title || 'eBook Reader'}
        </Heading>

        <Flex align="center" gap={4}>
          <Button variant="ghost" size="sm" p={1} onClick={() => speak(selectedText)}>
            <Volume2 size={16} />
          </Button>

          <Flex align="center" gap={2}>
            <Button variant="ghost" size="sm" p={1} onClick={() => handleFontSizeChange(-10)}>
              <Minus size={16} />
            </Button>
            <Box fontSize="sm">{fontSize}%</Box>
            <Button variant="ghost" size="sm" p={1} onClick={() => handleFontSizeChange(10)}>
              <Plus size={16} />
            </Button>
          </Flex>

          <Button variant="ghost" size="sm" p={1} onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          <Button variant="ghost" size="sm" p={1} onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </Flex>
      </Flex>

      {/* Main content */}
      <Box flex="1" h="full">
        {book?.cloudUrl && (
          <ReactReader
            url={book.cloudUrl}
            location={location}
            locationChanged={(loc: string) => setLocation(loc)}
            getRendition={rendition => {
              renditionRef.current = rendition;
              rendition.themes.fontSize(`${fontSize}%`);

              if (isDarkMode) {
                rendition.themes.register('dark', {
                  body: {
                    color: '#ffffff !important',
                    background: '#1a202c !important',
                  }
                });
                rendition.themes.select('dark');
              }

              rendition.on('selected', (cfiRange: string, contents: Contents) => {
                const text = rendition.getRange(cfiRange).toString();
                if (text.length > 0) {
                  setSelectedText(text);
                }

                contents.document.addEventListener('mouseup', () => {
                  if (contents.window.getSelection()?.toString().length === 0) {
                    setSelectedText('');
                  }
                });
              });

              rendition.on('relocated', (location: Location) => {
                if (tocRef.current) {
                  const pageIdx = tocRef.current[location.start.href];

                  if (!isNaN(pageIdx)) {
                    pageIndex.current = pageIdx;
                    setCurrentPage(pageIdx + 1);
                  }
                }
              });
            }}
            tocChanged={toc => {
              if (tocRef.current) return;

              const dict: { [x: string]: number } = {};
              let idx = 0;
              for (const item of toc) {
                dict[item.href] = idx;
                idx++;
              }

              tocRef.current = dict;
            }}
            epubOptions={{
              flow: 'paginated',
              manager: 'default'
            }}
          />
        )}
      </Box>

      {/* Progress bar */}
      <ProgressUI currentPage={currentPage} totalPages={totalPages} isDarkMode={isDarkMode} />
    </Box>
  );
}