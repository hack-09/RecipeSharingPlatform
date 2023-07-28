import time

# Get the current time in seconds since the epoch
current_time_seconds = time.time()

# Convert the time in seconds to a time struct in local time
time_struct = time.localtime(current_time_seconds)

# Format the time struct into a human-readable string
a=formatted_time = time.strftime(" %H:%M:%S", time_struct)

print(a)

