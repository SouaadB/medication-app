class UserProfile {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String? chifaCardNumber;
  final String? dateOfBirth;
  final String? dateOfBirthFormatted;
  final String? smartphoneSkillLevel;
  final bool? isActive;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.chifaCardNumber,
    this.dateOfBirth,
    this.dateOfBirthFormatted,
    this.smartphoneSkillLevel,
    this.isActive,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      role: json['role'],
      chifaCardNumber: json['chifa_card_registration_number'],
      dateOfBirth: json['date_of_birth'],
      dateOfBirthFormatted: json['date_of_birth_formatted'],
      smartphoneSkillLevel: json['smartphone_skill_level'],
      isActive: json['is_active'] == 1 || json['is_active'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'chifa_card_registration_number': chifaCardNumber,
      'date_of_birth': dateOfBirth,
      'date_of_birth_formatted': dateOfBirthFormatted,
      'smartphone_skill_level': smartphoneSkillLevel,
      'is_active': isActive,
    };
  }

  UserProfile copyWith({
    String? name,
    String? phone,
    String? chifaCardNumber,
    String? dateOfBirth,
    String? smartphoneSkillLevel,
  }) {
    return UserProfile(
      id: id,
      name: name ?? this.name,
      email: email,
      phone: phone ?? this.phone,
      role: role,
      chifaCardNumber: chifaCardNumber ?? this.chifaCardNumber,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      dateOfBirthFormatted: dateOfBirthFormatted,
      smartphoneSkillLevel: smartphoneSkillLevel ?? this.smartphoneSkillLevel,
      isActive: isActive,
    );
  }
}
