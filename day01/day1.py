lines = open('day1.txt').read().splitlines()

a = []
b = []

for line in lines:
    [first, second] = line.split()
    a.append(int(first))
    b.append(int(second))

a.sort()
b.sort()

sum = 0
for a1, b1 in zip(a, b):
    sum += abs(a1 - b1)

print('part 1')
print(sum)

sum = 0
def count(haystack, needle):
    return len([x for x in haystack if x == needle])

for a1, b1 in zip(a, b):
    sum += count(b, a1) * a1

print('part 2')
print(sum)
