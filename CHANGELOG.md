# Change Log

All notable changes to the "SDF Language Support" extension will be documented in this file.

## [1.0.0] - 2025-01-15

### Added
- Initial release of SDF Language Support extension
- Syntax highlighting for SDF (Simulation Description Format) files
- Context-aware auto-completion for SDF elements and attributes
- Real-time error detection and schema validation
- Hover documentation for SDF elements and attributes
- Custom file icons for `.sdf` and `.world` files
- Document formatting support
- Joint type validation (revolute, prismatic, ball, universal, fixed, continuous)
- Sensor type support (camera, lidar, imu, gps, contact, force_torque)
- Commands: Format Document, Validate Document
- Support for SDF versions 1.0 through 1.9

### Features
- **Smart Completions**: Context-aware suggestions based on parent elements
- **Error Prevention**: Catches missing closing tags, invalid joint types, missing required attributes
- **Professional Styling**: Robotics-themed syntax highlighting with gradient file icons
- **Documentation**: Instant hover help with examples and valid values
- **Robotics Snippets**: Quick insertion of common patterns (inertial properties, geometry)

### Supported Files
- `.sdf` - SDF model and world files
- `.world` - Gazebo world files

### Requirements
- VS Code 1.74.0 or higher

---

## [Unreleased]

### Planned Features
- URDF file support and conversion utilities
- Gazebo plugin auto-completion
- SDF schema validation for specific versions
- Integration with ROS workspace detection
- Model library integration
- 3D preview capabilities (future enhancement)