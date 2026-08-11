#include <windows.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define BF6_EXCEPTION 0xE0424636u

static const char g_key_string[16] = "I wanna play BF6";

static const uint8_t g_cipher[40] = {
    0xd4, 0x82, 0xb1, 0x72, 0x79, 0xa8, 0x0b, 0x46,
    0x32, 0x0e, 0x09, 0x14, 0xbe, 0x53, 0x28, 0x72,
    0x93, 0xd8, 0x44, 0x51, 0x4b, 0xf4, 0x0d, 0x05,
    0xce, 0xf8, 0x93, 0x87, 0xae, 0x74, 0xd8, 0x14,
    0x47, 0x5c, 0xa7, 0x15, 0x38, 0xc9, 0x89, 0x58
};

static char g_input[128];
static volatile int g_checked = 0;
static volatile int g_success = 0;

static uint32_t load32le(const uint8_t *p) {
    return ((uint32_t)p[0]) |
           ((uint32_t)p[1] << 8) |
           ((uint32_t)p[2] << 16) |
           ((uint32_t)p[3] << 24);
}

static void store32le(uint8_t *p, uint32_t x) {
    p[0] = (uint8_t)x;
    p[1] = (uint8_t)(x >> 8);
    p[2] = (uint8_t)(x >> 16);
    p[3] = (uint8_t)(x >> 24);
}

static void decrypt_block(uint32_t v[2], const uint32_t key[4]) {
    uint32_t v0 = v[0];
    uint32_t v1 = v[1];
    uint32_t delta = 0x9E3779B9u;
    uint32_t sum = delta * 32u;

    for (int i = 0; i < 32; i++) {
        uint32_t tmp = (((v0 >> 5) ^ (v0 << 4)) + v0);
        v1 -= (tmp ^ (key[(sum >> 11) & 3u] + sum));

        sum -= delta;

        tmp = (((v1 >> 5) ^ (v1 << 4)) + v1);
        v0 -= (tmp ^ (key[0] + sum));
    }

    v[0] = v0;
    v[1] = v1;
}

static int check_flag(const char *input) {
    uint32_t key[4];
    uint8_t plain[sizeof(g_cipher) + 1];

    for (int i = 0; i < 4; i++) {
        key[i] = load32le((const uint8_t *)g_key_string + i * 4);
    }

    for (size_t i = 0; i < sizeof(g_cipher); i += 8) {
        uint32_t v[2];
        v[0] = load32le(g_cipher + i);
        v[1] = load32le(g_cipher + i + 4);
        decrypt_block(v, key);
        store32le(plain + i, v[0]);
        store32le(plain + i + 4, v[1]);
    }

    plain[sizeof(g_cipher)] = 0;
    return strcmp(input, (const char *)plain) == 0;
}

static LONG WINAPI bf6_veh(EXCEPTION_POINTERS *info) {
    if (info->ExceptionRecord->ExceptionCode != BF6_EXCEPTION) {
        return EXCEPTION_CONTINUE_SEARCH;
    }

    g_success = check_flag(g_input);
    g_checked = 1;
    return EXCEPTION_CONTINUE_EXECUTION;
}

int main(void) {
    puts("I wanna play BF6");
    printf("flag: ");

    if (!fgets(g_input, sizeof(g_input), stdin)) {
        return 1;
    }

    g_input[strcspn(g_input, "\r\n")] = 0;

    AddVectoredExceptionHandler(1, bf6_veh);
    RaiseException(BF6_EXCEPTION, 0, 0, NULL);

    if (!g_checked) {
        puts("exception lost");
        return 1;
    }

    puts(g_success ? "correct" : "wrong");
    return g_success ? 0 : 1;
}
