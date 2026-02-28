CC = clang++
CFLAGS = -std=c++17 -Wall -O3
TARGET = bin/natural

all: $(TARGET)

$(TARGET): src/cpp/main.cpp
	mkdir -p bin
	$(CC) $(CFLAGS) src/cpp/main.cpp -o $(TARGET)

clean:
	rm -rf bin
