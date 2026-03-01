CC = clang++
CFLAGS = -std=c++17 -Wall -O3
TARGET = bin/natural

all: $(TARGET)

$(TARGET): src/cpp/natural.cpp
	mkdir -p bin
	$(CC) $(CFLAGS) src/cpp/natural.cpp -o $(TARGET)

clean:
	rm -rf bin
