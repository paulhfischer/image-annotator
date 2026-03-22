BORDER=20

unique_base_filenames=()
pushd original > /dev/null
for file_name in *.jpg; do
    base_filename="${file_name%.*}"
    base_filename="${base_filename/_clean/}"
    if [[ ! " ${unique_base_filenames[@]} " =~ " ${base_filename} " ]]; then
        unique_base_filenames+=("$base_filename")
    fi
done
popd > /dev/null

done_base_filenames=()
pushd trimmed > /dev/null
for file_name in *.jpg; do
    base_filename="${file_name%.*}"
    base_filename="${base_filename/_clean/}"
    if [[ ! " ${done_base_filenames[@]} " =~ " ${base_filename} " ]]; then
        done_base_filenames+=("$base_filename")
    fi
done
popd > /dev/null

# echo $unique_base_filenames

for IMG in "${unique_base_filenames[@]}"; do
    if [[ ! "${done_base_filenames[@]}" =~ "$IMG" ]]; then
        trimbox=$(convert "original/${IMG}_clean.jpg" -fuzz 5% -format "%@" info:)
        orig=$trimbox
        first=${trimbox%x*}
        trimbox=${trimbox#*x}
        second=${trimbox%%+*}
        trimbox=${trimbox#*+}
        third=${trimbox%+*}
        fourth=${trimbox#*+}
        # echo "trimbox: $orig first: $first second: $second third: $third fourth:$fourth"
        ((first+=BORDER))
        ((first+=BORDER))
        ((second+=BORDER))
        ((second+=BORDER))
        ((third-=BORDER))
        ((fourth-=BORDER))
        trimbox=$first"x"$second"+"$third"+"$fourth
        echo "$IMG | trimbox: $trimbox first: $first second: $second third: $third fourth:$fourth"
        convert "original/${IMG}.jpg" -crop "$trimbox" +repage "trimmed/${IMG}.jpg"
        convert "original/${IMG}_clean.jpg" -crop "$trimbox" +repage "trimmed/${IMG}_clean.jpg"
    fi
done
